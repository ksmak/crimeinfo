from rest_framework import serializers

from .models import (
    Category,
    Region,
    District,
    Item,
    Info,
    Test,
    UserRole
)
from auths.serializers import MyUserSerializer


class RegionSerializer(serializers.ModelSerializer):
    """
    Region serializer.
    """
    class Meta:
        model = Region
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    """
    District serializer.
    """
    class Meta:
        model = District
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    """
    Category serializer.
    """
    class Meta:
        model = Category
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    """
    Item serializer.
    """
    region = RegionSerializer()
    district = DistrictSerializer()
    author = MyUserSerializer()

    class Meta:
        model = Item
        fields = '__all__'


class InfoSerializer(serializers.ModelSerializer):
    """
    Info serializer.
    """
    class Meta:
        model = Info
        fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    """
    Test serializer.
    """
    class Meta:
        model = Test
        fields = '__all__'


class UserRoleSerializer(serializers.ModelSerializer):
    """
    User role serializer
    """
    class Meta:
        model = UserRole
        fields = ('role', )
