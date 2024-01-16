from django.test import TestCase
from django.contrib.auth import get_user_model, authenticate

from rest_framework.test import (
    APIRequestFactory,
    force_authenticate,
)
from rest_framework.status import HTTP_200_OK

from .views import UserViewSet
from .serializers import MyUserSerializer


class SigninTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='testuser@mail.ru',
            password='Zz@12345',
        )
        self.name = 'Ахмет'
        self.surname = 'Ахметов'
        self.patronymic = 'Ахметович'
        self.user.save()

    def tearDown(self):
        self.user.delete()

    def test_correct_user(self):
        user = authenticate(username='testuser', password='Zz@12345')
        self.assertTrue((user is not None) and user.is_authenticated)

    def test_wrong_username(self):
        user = authenticate(username='wronguser', password='Zz@12345')
        self.assertFalse((user is not None) and user.is_authenticated)

    def test_wrong_password(self):
        user = authenticate(username='testuser', password='wrongpass')
        self.assertFalse((user is not None) and user.is_authenticated)

    def test_user_fullname(self):
        self.assertEqual(
            f"{self.user.name} {self.user.surname} {self.user.patronymic}",
            self.user.full_name
        )


class UserViewSetTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='testuser@mail.ru',
            password='Zz@12345',
        )
        self.user.save()
        self.superuser = get_user_model().objects.create_superuser(
            email='testsuperuser@mail.ru',
            password='Zz@12345',
        )
        self.superuser.save()
        self.factory = APIRequestFactory()
        self.view = UserViewSet.as_view({'get': 'list'})

    def tearDown(self):
        self.user.delete()

    def test_list_without_authenticate(self):
        request = self.factory.get('/api/users/')
        response = self.view(request)
        self.assertNotEqual(response.status_code, HTTP_200_OK)

    def test_list_with_authenticate(self):
        request = self.factory.get('/api/users/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, HTTP_200_OK)
        serializer = MyUserSerializer([self.user], many=True)
        self.assertListEqual(serializer.data, response.data)
