from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet

from .serializers import MyUserSerializer
from .permissions import SelfUser


class UserViewSet(ModelViewSet):
    """
    User viewset
    """
    queryset = get_user_model().objects.all()
    serializer_class = MyUserSerializer
    permission_classes = (SelfUser, )
