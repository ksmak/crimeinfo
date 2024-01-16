from rest_framework.viewsets import (
    ReadOnlyModelViewSet,
    ModelViewSet,
)
from rest_framework.permissions import AllowAny

from .models import Category, Item, Info, Test
from .serializers import (
    CategorySerializer,
    ItemSerializer,
    InfoSerializer,
    TestSerializer,
)
from .permissions import (
    ItemEditor,
    InfoEditor,
    TestEditor,
)


class CategoryViewSet(ReadOnlyModelViewSet):
    """
    Category viewset.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny, )


class ItemViewSet(ModelViewSet):
    """
    Item viewset.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (ItemEditor, )


class InfoViewSet(ModelViewSet):
    """
    Info viewset.
    """
    queryset = Info.objects.all()
    serializer_class = InfoSerializer
    permission_classes = (InfoEditor, )


class TestViewSet(ReadOnlyModelViewSet):
    """
    Test viewset.
    """
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = (TestEditor, )
