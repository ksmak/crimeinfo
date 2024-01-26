from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    MyObtainTokenPairView,
    RegisterView,
    ActivateView,
    ProfileViewSet,
    SendEmailResetPasswordView,
    ResetPasswordView,
)


router = DefaultRouter()
router.register('users', ProfileViewSet, basename='users')

urlpatterns = [
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('activate/', ActivateView.as_view(), name='auth_activate'),
    path('reset_password/', SendEmailResetPasswordView.as_view(),
         name='auth_reset_password'),
    path('confirm_reset/', ResetPasswordView.as_view(),
         name='auth_confirm_reset'),
    path('', include(router.urls)),
]
