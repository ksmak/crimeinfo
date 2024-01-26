from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
import smtplib

from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST
)
from rest_framework.decorators import action

from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    ProfileSerializer,
    ChangePasswordSerializer,
)
from .permissions import SelfUser
from .utils import MAX_ACTIVATION_CODE_SIZE, get_activation_code


User = get_user_model()


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ActivateView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        code = request.data.get('activation_code')
        user = User.objects.filter(activation_code=code).first()
        if not user:
            return Response(data={
                'errors': f'User with code: {code} not found.'
            }, status=HTTP_404_NOT_FOUND)

        user.activation_code = None
        user.is_active = True
        user.save()
        return Response({'ok': True}, status=HTTP_200_OK)


class SendEmailResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(data={
                'errors': f'Ошибка! Пользователь с таким адресом не существует'
            }, status=HTTP_404_NOT_FOUND)

        user.activation_code = get_activation_code(MAX_ACTIVATION_CODE_SIZE)
        user.save()

        link = f"{settings.CLIENT_HOST}/confirm_reset_password/{user.activation_code}/"  # noqa

        try:
            send_mail(
                'Смена пароля в crimeinfo.kz',
                (f'Мы получили запрос на смену пароля вашей учётной записи.\n'
                 f'Если вы делали такой запрос, нажмите на ссылку ниже. '
                 f'Если нет, просто проигнорируйте это письмо.\n\n{link}\n\n'
                 '(Ссылка в письме не работает? Попробуйте скопировать'
                 ' её и вставить в адресную строку браузера!)'),
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=True
            )
        except smtplib.SMTPException:
            print("Error sending mail!")

        return Response({'ok': True}, status=HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        code = request.data.get('activation_code')
        new_password = request.data.get('new_password')
        user = User.objects.filter(activation_code=code).first()
        if not user:
            return Response(data={
                'new_password': f'User with code: {code} not found.'
            }, status=HTTP_404_NOT_FOUND)

        serializer = ChangePasswordSerializer(data={
            'new_password': new_password
        })
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_404_NOT_FOUND)

        user.activation_code = None
        user.set_password(new_password)
        user.save()
        return Response({'ok': True}, status=HTTP_200_OK)


class ProfileViewSet(ModelViewSet):
    """
    User profile viewset
    """
    queryset = User.objects.all()
    permission_classes = (SelfUser, )
    serializer_class = ProfileSerializer

    @action(detail=False, methods=['POST'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        request.user.set_password(serializer.validated_data['new_password'])
        return Response({'ok': True}, status=HTTP_200_OK)
