from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField


class Category(models.Model):
    """
    Category model
    """
    order = models.PositiveSmallIntegerField(
        verbose_name='порядковый номер',
        default=0
    )
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300
    )
    photo = models.ImageField(
        verbose_name='фото',
        upload_to='images/',
        blank=True,
        null=True
    )
    data = models.JSONField(
        verbose_name='json данные',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.order} - {self.title_ru}"

    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'
        ordering = ('order', )


class Region(models.Model):
    """
    Region model.
    """
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300
    )

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = 'область'
        verbose_name_plural = 'области'
        ordering = ('title', )


class District(models.Model):
    """
    District model.
    """
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300
    )

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = 'район'
        verbose_name_plural = 'районы'
        ordering = ('title', )


class Item(models.Model):
    """
    Item model
    """
    is_active = models.BooleanField(
        verbose_name='активность',
        default=False
    )
    category = models.ForeignKey(
        verbose_name='категория',
        to=Category,
        on_delete=models.RESTRICT
    )
    region = models.ForeignKey(
        verbose_name='область',
        to=Region,
        on_delete=models.RESTRICT,
        blank=True,
        null=True
    )
    district = models.ForeignKey(
        verbose_name='район',
        to=District,
        on_delete=models.RESTRICT,
        blank=True,
        null=True
    )
    punkt_kk = models.CharField(
        verbose_name='населеный пункт на казахском',
        max_length=150
    )
    punkt_ru = models.CharField(
        verbose_name='населеный пункт на русском',
        max_length=150
    )
    punkt_en = models.CharField(
        verbose_name='населеный пункт на английском',
        max_length=150
    )
    date_of_action = models.DateField(
        verbose_name='дата происшествия (утери/похищения)'
    )
    time_of_action = models.TimeField(
        verbose_name='время происшествия (утери/похищения)'
    )
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300
    )
    text_kk = models.TextField(
        verbose_name='описание на казахском'
    )
    text_ru = models.TextField(
        verbose_name='описание на русском'
    )
    text_en = models.TextField(
        verbose_name='описание на английском'
    )
    is_reward = models.BooleanField(
        verbose_name='показывать надпись: вознаграждение гарантируется',
        default=False
    )
    show_danger_label = models.BooleanField(
        verbose_name='показывать надпись: внимание похищенная вещь',
        default=False
    )
    media = ArrayField(
        models.FileField(
            verbose_name='медиа-файлы',
            upload_to='media/',
            blank=True
        )
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.RESTRICT,
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.RESTRICT,
        null=True,
        blank=True
    )
    date_of_creation = models.DateTimeField(
        verbose_name='дата создания',
        auto_now_add=True
    )
    date_of_change = models.DateTimeField(
        verbose_name='дата изменения',
        auto_now=True
    )

    def __str__(self):
        return f"{self.is_active} {self.category} {self.title_ru}"

    class Meta:
        verbose_name = 'объявление'
        verbose_name_plural = 'объявления'
        ordering = ('-date_of_creation', )


class Info(models.Model):
    """
    Info model.
    """
    is_active = models.BooleanField(
        verbose_name='активность',
        default=False
    )
    order = models.PositiveSmallIntegerField(
        verbose_name='порядковый номер',
        default=0
    )
    date_of_action = models.DateField(
        verbose_name='дата происшествия',
        null=True,
        blank=True
    )
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
    )
    text_kk = models.TextField(
        verbose_name='описание на казахском'
    )
    text_ru = models.TextField(
        verbose_name='описание на русском'
    )
    text_en = models.TextField(
        verbose_name='описание на английском'
    )
    media = ArrayField(
        models.FileField(
            verbose_name='медиа-файлы',
            upload_to='media/',
            blank=True
        )
    )
    data = models.JSONField(
        verbose_name='json данные',
        blank=True,
        null=True
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.RESTRICT,
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.RESTRICT,
        null=True,
        blank=True
    )
    date_of_creation = models.DateTimeField(
        verbose_name='дата создания',
        auto_now_add=True
    )
    date_of_change = models.DateTimeField(
        verbose_name='дата изменения',
        auto_now=True
    )

    def __str__(self):
        return f"{self.order} - {self.title}"

    class Meta:
        verbose_name = 'новость'
        verbose_name_plural = 'новости'


class Test(models.Model):
    """
    Test model.
    """
    is_active = models.BooleanField(
        verbose_name='активность',
        default=False
    )
    order = models.PositiveSmallIntegerField(
        verbose_name='порядковый номер',
        default=0
    )
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
    )
    data = models.JSONField(
        verbose_name='json данные',
        blank=True,
        null=True
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.RESTRICT,
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.RESTRICT,
        null=True,
        blank=True
    )
    date_of_creation = models.DateTimeField(
        verbose_name='дата создания',
        auto_now_add=True
    )
    date_of_change = models.DateTimeField(
        verbose_name='дата изменения',
        auto_now=True
    )

    def __str__(self):
        return f"{self.order} - {self.title}"

    class Meta:
        verbose_name = 'опрос'
        verbose_name_plural = 'опросы'


class UserRole(models.Model):
    """
    User role model
    """
    ROLE_ADMIN = 'admin'
    ROLE_ITEM_EDITOR = 'item_edit'
    ROLE_INFO_EDITOR = 'info_edit'
    ROLE_TEST_EDITOR = 'test_edit'
    ROLES = (
        (ROLE_ADMIN, 'Администратор системы'),
        (ROLE_ITEM_EDITOR, 'Оператор корректировки объявлений'),
        (ROLE_INFO_EDITOR, 'Оператор корректировки новостей'),
        (ROLE_TEST_EDITOR, 'Оператор корректировки опросов'),
    )
    user = models.ForeignKey(
        verbose_name='пользователь',
        to=get_user_model(),
        on_delete=models.RESTRICT
    )
    role = models.CharField(
        verbose_name='роль',
        max_length=50,
        choices=ROLES
    )
    date_of_creation = models.DateTimeField(
        verbose_name='дата создания',
        auto_now_add=True
    )
    date_of_change = models.DateTimeField(
        verbose_name='дата изменения',
        auto_now=True
    )

    def __str__(self):
        return f"{self.user} - {self.role}"

    class Meta:
        verbose_name = 'роль пользователя'
        verbose_name_plural = 'роли пользователей'
