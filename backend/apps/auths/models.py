from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
from .utils import MAX_ACTIVATION_CODE_SIZE


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValidationError("Логин(почта) не должен быть пустым")

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email=email,
            password=password,
        )
        user.is_active = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name='логин(почта)',
        max_length=150,
        unique=True
    )
    name = models.CharField(
        verbose_name='имя',
        max_length=255,
        blank=True,
        null=True
    )
    surname = models.CharField(
        verbose_name='фамилия',
        max_length=255,
        blank=True,
        null=True
    )
    patronymic = models.CharField(
        verbose_name='отчество',
        max_length=255,
        blank=True,
        null=True
    )
    phone = models.PositiveBigIntegerField(
        verbose_name='контактный телефон',
        blank=True,
        null=True
    )
    avatar = models.ImageField(
        verbose_name='аватар',
        blank=True,
        null=True
    )
    activation_code = models.CharField(
        verbose_name='код активации',
        max_length=MAX_ACTIVATION_CODE_SIZE,
        blank=True,
        null=True
    )
    is_active = models.BooleanField(
        verbose_name='активность',
        default=False
    )
    is_superuser = models.BooleanField(
        verbose_name='является администратором',
        default=False
    )
    is_staff = models.BooleanField(
        verbose_name='является штатным сотрудником',
        default=False
    )
    date_of_creation = models.DateTimeField(
        verbose_name='дата создания',
        auto_now_add=True
    )
    date_of_change = models.DateTimeField(
        verbose_name='дата изменения',
        auto_now=True
    )
    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.surname} {self.name} {self.patronymic}"

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'
