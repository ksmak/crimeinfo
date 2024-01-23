from django.contrib.auth import get_user_model

from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    ProfileSerializer
)
from .permissions import SelfUser


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
        return Response(data={'errors': None}, status=HTTP_200_OK)


class ProfileViewSet(ViewSet):
    """
    User profile viewset
    """
    queryset = User.objects.all()
    permission_classes = (SelfUser, )
    serializer_class = ProfileSerializer
