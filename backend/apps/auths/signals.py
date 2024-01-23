from typing import Any

from django.conf import settings
from django.core.mail import send_mail
from django.db.models.base import ModelBase
from django.db.models.signals import post_save
from django.dispatch import receiver
import smtplib

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
    if not created:
        return

    """Активация пользователя по почте."""
    link: str = f"{settings.CLIENT_HOST}/activate/{instance.activation_code}/"

    print("Отправка сообщения на почту...", instance.email)

    try:
        send_mail(
            'Активация пользователя в crimeinfo.kz',
            (f'Мы получили запрос на активацию вашей учётной записи.\n'
             f'Если вы делали такой запрос, нажмите на ссылку ниже. '
             f'Если нет, просто проигнорируйте это письмо.\n\n{link}\n\n'
             '(Ссылка в письме не работает? Попробуйте скопировать'
             ' её и вставить в адресную строку браузера!)'),
            settings.EMAIL_HOST_USER,
            [instance.email],
            fail_silently=True
        )
    except smtplib.SMTPException:
        print("Error sending mail!")
