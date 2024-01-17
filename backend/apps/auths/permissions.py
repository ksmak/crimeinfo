from rest_framework import permissions


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

        if request.user.is_staff and obj.email == request.user.email:
            return True

        return False
