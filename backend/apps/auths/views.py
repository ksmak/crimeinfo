from django.contrib.auth import get_user_model

from rest_framework.permissions import AllowAny
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer
)


User = get_user_model()


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ActivateView(GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        code = request.data.get('activation_code')
        try:
            user = User.objects.get(activation_code=code)
            user.is_active = True
            user.save()
            return Response(data={'errors': None}, status=HTTP_200_OK)
        except:
            return Response(data={
                'errors': f'User with code: {code} not found.'
            }, status=HTTP_404_NOT_FOUND)
