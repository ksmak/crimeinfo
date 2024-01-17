from rest_framework import permissions
from .models import UserRole


class ItemEditor(permissions.BasePermission):
    """
    Permission for Item
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        role = UserRole.objects.filter(
            user=request.user, role=UserRole.ROLE_ITEM_EDITOR)

        if not role:
            return True

        return False


class InfoEditor(permissions.BasePermission):
    """
    Permission for Info
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        role = UserRole.objects.filter(
            user=request.user, role=UserRole.ROLE_INFO_EDITOR)

        if not role:
            return True

        return False


class TestEditor(permissions.BasePermission):
    """
    Permission for Test
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        role = UserRole.objects.filter(
            user=request.user, role=UserRole.ROLE_TEST_EDITOR)

        if not role:
            return True

        return False


class SelfUser(permissions.BasePermission):
    """
    Self user
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_staff and obj.user == request.user:
            return True

        return False
