from datetime import datetime, date, time
from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from .models import (
    Region,
    District,
    Item,
    Info,
    Test
)

from unittest.mock import ANY


class ChatViewTest(TestCase):
    def setUp(self):
        region = Region.objects.create(
            title_kk='Region kk',
            title_ru='Region ru',
            title_en='Region en'
        )
        district = District.objects.create(
            title_kk='District kk',
            title_ru='District ru',
            title_en='District en'
        )
        self.user = get_user_model().objects.create_user(
            email="user@mail.ru",
            password="Zz@12345",
        )
        self.user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.client.force_authenticate(user=None)
        self.user.delete()

    def test_create_item(self):
        request_data = {
            'is_active': True,
            'region': self.region.id,
            'district': self.district.id,
            'punkt_kk': 'Punkt kk',
            'punkt_ru': 'Punkt ru',
            'punkt_en': 'Punkt en',
            'date_of_action': date(2024, 1, 1),
            'time_of_action': time(12, 1),
            'title_kk': 'Item title kk',
            'title_ru': 'Item title ru',
            'title_en': 'Item title en',
            'text_kk': 'Item text kk',
            'text_ru': 'Item text ru',
            'text_en': 'Item text en',
            'is_reward': True,
            'show_danger_label': True,
            'user_create': [self.user.id],
            'user_change': [self.user.id],
        }
        expected_data = {
            'id': 1,
            'is_active': True,
            'region': self.region.id,
            'district': self.district.id,
            'punkt_kk': 'Punkt kk',
            'punkt_ru': 'Punkt ru',
            'punkt_en': 'Punkt en',
            'date_of_action': date(2024, 1, 1),
            'time_of_action': time(12, 1),
            'title_kk': 'Item title kk',
            'title_ru': 'Item title ru',
            'title_en': 'Item title en',
            'text_kk': 'Item text kk',
            'text_ru': 'Item text ru',
            'text_en': 'Item text en',
            'is_reward': True,
            'show_danger_label': True,
            'user_create': [self.user.id],
            'user_change': [self.user.id],
            'date_of_creation': ANY,
            'date_of_change': ANY
        }
        response = self.client.post(
            path='/api/items/',
            data=request_data,
            format='json'
        )
        assert response.status_code == 200
        self.assertDictEqual(expected_data, response.data)

    def test_list_chat(self):
        item = Item.objects.create(
            is_active=True,
            region=self.region.id,
            district=self.district.id,
            punkt_kk='Punkt kk',
            punkt_ru='Punkt ru',
            punkt_en='Punkt en',
            date_of_action=date(2024, 1, 1),
            time_of_action=time(12, 1),
            title_kk='Item title kk',
            title_ru='Item title ru',
            title_en='Item title en',
            text_kk='Item text kk',
            text_ru='Item text ru',
            text_en='Item text en',
            is_reward=True,
            show_danger_label=True,
            user_create=[self.user.id],
            user_change=[self.user.id],
        )
        expected_data = [
            {
                'id': 1,
                'is_active': True,
                'region': self.region.id,
                'district': self.district.id,
                'punkt_kk': 'Punkt kk',
                'punkt_ru': 'Punkt ru',
                'punkt_en': 'Punkt en',
                'date_of_action': date(2024, 1, 1),
                'time_of_action': time(12, 1),
                'title_kk': 'Item title kk',
                'title_ru': 'Item title ru',
                'title_en': 'Item title en',
                'text_kk': 'Item text kk',
                'text_ru': 'Item text ru',
                'text_en': 'Item text en',
                'is_reward': True,
                'show_danger_label': True,
                'user_create': [self.user.id],
                'user_change': [self.user.id],
                'date_of_creation': ANY,
                'date_of_change': ANY
            }
        ]
        response = self.client.get('/api/items/')
        assert response.status_code == 200
        self.assertListEqual(expected_data, response.data)
