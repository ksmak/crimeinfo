from typing import Any

from django.conf import settings
from django.core.mail import send_mail
from django.db.models.base import ModelBase
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import MyUser


@receiver(
    post_save,
    sender=MyUser
)
def post_save_custom_user(
    sender: ModelBase,
    instance: MyUser,
    created: bool,
    *args: Any,
    **kwargs: Any
) -> None:
    """Активация пользователя по почте."""
    if not created:
        return

    link: str = 'http://127.0.0.1:8000/activate/' + instance.activation_code

    print("Отправка сообщения на почту...", instance.email)

    # send_mail(
    #     'Подтверждение регистрации пользователя',
    #     f'Для подтверждения регистрации перейдите по следующей ссылке {link}',
    #     settings.EMAIL_HOST_USER,
    #     [ instance.email ],
    #     fail_silently=False
    # )
