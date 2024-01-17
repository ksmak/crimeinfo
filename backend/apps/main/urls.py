from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    DistrictViewSet,
    ItemViewSet,
    InfoViewSet,
    TestViewSet,
    UserRoleView,
)


router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('districts', DistrictViewSet, basename='districts')
router.register('items', ItemViewSet, basename='items')
router.register('info', InfoViewSet, basename='info')
router.register('tests', TestViewSet, basename='tests')

urlpatterns = [
    path('', include(router.urls)),
    path('roles/', UserRoleView.as_view(), name='roles')
]
