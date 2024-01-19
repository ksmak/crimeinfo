from django.db.models import Q
from django.db.models import Count

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.decorators import action, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

from .serializers import (
    CategorySerializer,
    RegionSerializer,
    DistrictSerializer,
    ItemSerializer,
    InfoSerializer,
    TestSerializer,
    TestResultSerializer,
    UserRoleSerializer,
    CommentSerializer,
)
from .permissions import (
    ItemEditor,
    InfoEditor,
    TestEditor,
    SelfUser,
)
from .models import (
    Category,
    Region,
    District,
    Item,
    ItemFile,
    Info,
    InfoFile,
    UserRole,
    Comment,
    Test,
    TestResult
)


class CategoryView(ListAPIView):
    """
    Category viewset.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny, )


class RegionView(ListAPIView):
    """
    Region viewset.
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = (AllowAny, )


class DistrictView(ListAPIView):
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
        queryset = None
        if self.request.user.is_authenticated:
            c1 = Q(create_user=self.request.user.id)
            c2 = Q(change_user=self.request.user.id)
            c3 = Q(is_active=True)
            queryset = Item.objects.filter(c1 | c2 | c3)
        else:
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
            c1 = Q(title_kk__icontains=searchText)
            c2 = Q(title_ru__icontains=searchText)
            c3 = Q(title_en__icontains=searchText)
            c4 = Q(text_kk__icontains=searchText)
            c5 = Q(text_ru__icontains=searchText)
            c6 = Q(text_en__icontains=searchText)
            queryset = queryset.filter(c1 | c2 | c3 | c4 | c5 | c6)

        if category is not None:
            queryset = queryset.filter(category=category)

        if region is not None:
            queryset = queryset.filter(region=region)

        if district is not None:
            queryset = queryset.filter(district=district)

        if punkt is not None:
            c1 = Q(punkt_kk__icontains=searchText)
            c2 = Q(punkt_ru__icontains=searchText)
            c3 = Q(punkt_en__icontains=searchText)
            queryset = queryset.filter(c1 | c2 | c3)

        if date_of_action_start is not None:
            queryset = queryset.filter(
                date_of_action__gte=date_of_action_start)

        if date_of_action_end is not None:
            queryset = queryset.filter(date_of_action__lte=date_of_action_end)

        queryset.order_by('-date_of_action')

        return queryset

    @action(detail=False)
    def group_by_category(self, request):
        result = Item.objects.values(
            'category').annotate(cnt=Count('category'))
        return Response(result)

    @action(detail=True, methods=('post', ))
    @parser_classes((MultiPartParser, FormParser))
    def upload_files(self, request, pk=None):
        item = None
        try:
            item = Item.objects.get(pk=pk)
        except:
            print('Error item not found.')

        if item is None:
            return Response({
                'errors': 'Item not found.'
            }, HTTP_404_NOT_FOUND)

        item.files.all().delete()
        for file in self.request.data.getlist('files'):
            mf = ItemFile.objects.create(item=item, file=file)
            item.files.add(mf)

        return Response({
            'ok'
        }, HTTP_200_OK)


class InfoViewSet(ModelViewSet):
    """
    Info viewset.
    """
    serializer_class = InfoSerializer
    permission_classes = (InfoEditor, )

    def get_queryset(self):
        queryset = None
        if self.request.user.is_authenticated:
            c1 = Q(create_user=self.request.user)
            c2 = Q(change_user=self.request.user)
            c3 = Q(is_active=True)
            queryset = Info.objects.filter(c1 | c2 | c3)
        else:
            queryset = Info.objects.filter(is_active=True)
        return queryset

    @action(detail=True, methods=('post', ))
    @parser_classes((MultiPartParser, FormParser))
    def upload_files(self, request, pk=None):
        info = None
        try:
            info = Info.objects.get(pk=pk)
        except:
            print('Error info not found.')

        if info is None:
            return Response({
                'errors': 'Info not found.'
            }, HTTP_404_NOT_FOUND)

        info.files.all().delete()
        for file in self.request.data.getlist('files'):
            mf = InfoFile.objects.create(info=info, file=file)
            info.files.add(mf)

        return Response({
            'ok'
        }, HTTP_200_OK)


class TestViewSet(ModelViewSet):
    """
    Test viewset.
    """
    serializer_class = TestSerializer
    permission_classes = (TestEditor, )

    def get_queryset(self):
        queryset = None
        if self.request.user.is_authenticated:
            c1 = Q(create_user=self.request.user)
            c2 = Q(change_user=self.request.user)
            c3 = Q(is_active=True)
            queryset = Test.objects.filter(c1 | c2 | c3)
        else:
            queryset = Test.objects.filter(is_active=True)

        return queryset


class TestResultViewSet(ModelViewSet):
    """
    Test result viewset.
    """
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = (SelfUser, )


class UserRoleView(ListAPIView):
    """
    User role view
    """
    serializer_class = UserRoleSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        return UserRole.objects.filter(user=user)


class CommentViewSet(ModelViewSet):
    """
    Comment view
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (AllowAny, )

    @action(detail=False)
    def for_item(self, request):
        item_id = self.request.query_params.get('item_id')
        result = Comment.objects.filter(item=item_id)
        return Response(result)
