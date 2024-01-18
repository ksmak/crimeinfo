from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    CategoryView,
    RegionView,
    DistrictView,
    ItemViewSet,
    InfoViewSet,
    TestViewSet,
    TestResultViewSet,
    UserRoleView,
    CommentViewSet,
)


router = DefaultRouter()
router.register('items', ItemViewSet, basename='items')
router.register('info', InfoViewSet, basename='info')
router.register('tests', TestViewSet, basename='tests')
router.register('test_results', TestResultViewSet, basename='test_results')
router.register('comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='categories'),
    path('regions/', RegionView.as_view(), name='regions'),
    path('districts/', DistrictView.as_view(), name='districts'),
    path('', include(router.urls)),
    path('roles/', UserRoleView.as_view(), name='roles')
]
