from django.db.models import Q

from rest_framework.viewsets import (
    ReadOnlyModelViewSet,
    ModelViewSet,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView

from .models import Category, District, Item, Info, Test
from .serializers import (
    CategorySerializer,
    DistrictSerializer,
    ItemSerializer,
    InfoSerializer,
    TestSerializer,
    UserRoleSerializer
)
from .permissions import (
    ItemEditor,
    InfoEditor,
    TestEditor,
)
from .models import UserRole


class CategoryViewSet(ReadOnlyModelViewSet):
    """
    Category viewset.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny, )


class DistrictViewSet(ReadOnlyModelViewSet):
    """
    District viewset.
    """
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = (AllowAny, )


class ItemViewSet(ModelViewSet):
    """
    Item viewset.
    """
    serializer_class = ItemSerializer
    permission_classes = (ItemEditor, )

    def get_queryset(self):
        queryset = Item.objects.filter(is_active=True)
        searchText = self.request.query_params.get('searchText')
        category = self.request.query_params.get('category')
        region = self.request.query_params.get('region')
        district = self.request.query_params.get('district')
        punkt = self.request.query_params.get('punkt')
        date_of_action_start = self.request.query_params.get(
            'date_of_action_start')
        date_of_action_end = self.request.query_params.get(
            'date_of_action_end')

        if searchText is not None:
            c1 = Q(title_kk__contains=searchText)
            c2 = Q(title_ru__contains=searchText)
            c3 = Q(title_en__contains=searchText)
            c4 = Q(text_kk__contains=searchText)
            c5 = Q(text_ru__contains=searchText)
            c6 = Q(text_en__contains=searchText)
            queryset = queryset.filter(c1 | c2 | c3 | c4 | c5 | c6)

        if category is not None:
            queryset = queryset.filter(category=category)

        if region is not None:
            queryset = queryset.filter(region=region)

        if district is not None:
            queryset = queryset.filter(district=district)

        if punkt is not None:
            c1 = Q(punkt_kk__contains=searchText)
            c2 = Q(punkt_ru__contains=searchText)
            c3 = Q(punkt_en__contains=searchText)
            queryset = queryset.filter(c1 | c2 | c3)

        if date_of_action_start is not None:
            queryset = queryset.filter(
                date_of_action__gte=date_of_action_start)

        if date_of_action_end is not None:
            queryset = queryset.filter(date_of_action__lte=date_of_action_end)

        queryset.order_by('-date_of_action')

        return queryset


class InfoViewSet(ModelViewSet):
    """
    Info viewset.
    """
    queryset = Info.objects.filter(is_active=True)
    serializer_class = InfoSerializer
    permission_classes = (InfoEditor, )


class TestViewSet(ReadOnlyModelViewSet):
    """
    Test viewset.
    """
    queryset = Test.objects.filter(is_active=True)
    serializer_class = TestSerializer
    permission_classes = (TestEditor, )


class UserRoleView(ListAPIView):
    """
    User role view
    """
    serializer_class = UserRoleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return UserRole.objects.filter(user=user)
