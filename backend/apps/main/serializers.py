from rest_framework import serializers

from .models import (
    Category,
    Region,
    District,
    Item,
    ItemFile,
    Info,
    InfoFile,
    Test,
    TestResult,
    UserRole,
    Comment,
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


class ItemFileSerializer(serializers.ModelSerializer):
    """
    Item file serializer
    """
    class Meta:
        model = ItemFile
        fields = ('item', 'file')


class ItemSerializer(serializers.ModelSerializer):
    """
    Item serializer.
    """
    files = ItemFileSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Item
        fields = '__all__'


class InfoFileSerializer(serializers.ModelSerializer):
    """
    Info file serializer
    """
    class Meta:
        model = InfoFile
        fields = '__all__'


class InfoSerializer(serializers.ModelSerializer):
    """
    Info serializer.
    """
    files = InfoFileSerializer(many=True)

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


class TestResultSerializer(serializers.ModelSerializer):
    """
    Test result serializer.
    """
    class Meta:
        model = TestResult
        fields = '__all__'


class UserRoleSerializer(serializers.ModelSerializer):
    """
    User role serializer
    """
    class Meta:
        model = UserRole
        fields = ('role', )


class CommentSerializer(serializers.ModelSerializer):
    """
    Comment serializer
    """
    class Meta:
        model = Comment
        fields = '__all__'
