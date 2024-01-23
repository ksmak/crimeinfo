from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    MyObtainTokenPairView,
    RegisterView,
    ActivateView,
    ProfileViewSet,
)


router = DefaultRouter()
router.register('users', ProfileViewSet, basename='users')

urlpatterns = [
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('activate/', ActivateView.as_view(), name='auth_activate'),
    path('', include(router.urls)),
]
