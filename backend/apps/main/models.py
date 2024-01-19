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
    fields = models.JSONField(
        verbose_name='поля',
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
        return self.title_ru

    class Meta:
        verbose_name = 'область'
        verbose_name_plural = 'области'


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
        return self.title_ru

    class Meta:
        verbose_name = 'район'
        verbose_name_plural = 'районы'


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
        on_delete=models.RESTRICT,
        blank=True,
        null=True
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
        max_length=150,
        blank=True,
        null=True
    )
    punkt_ru = models.CharField(
        verbose_name='населеный пункт на русском',
        max_length=150,
        blank=True,
        null=True
    )
    punkt_en = models.CharField(
        verbose_name='населеный пункт на английском',
        max_length=150,
        blank=True,
        null=True
    )
    date_of_action = models.DateField(
        verbose_name='дата происшествия (утери/похищения)',
        blank=True,
        null=True
    )
    time_of_action = models.TimeField(
        verbose_name='время происшествия (утери/похищения)',
        blank=True,
        null=True
    )
    title_kk = models.CharField(
        verbose_name='наименование на казахском',
        max_length=300,
        blank=True,
        null=True
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300,
        blank=True,
        null=True
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300,
        blank=True,
        null=True
    )
    text_kk = models.TextField(
        verbose_name='описание на казахском',
        blank=True,
        null=True
    )
    text_ru = models.TextField(
        verbose_name='описание на русском',
        blank=True,
        null=True
    )
    text_en = models.TextField(
        verbose_name='описание на английском',
        blank=True,
        null=True
    )
    is_reward = models.BooleanField(
        verbose_name='показывать надпись: вознаграждение гарантируется',
        default=False
    )
    show_danger_label = models.BooleanField(
        verbose_name='показывать надпись: внимание похищенная вещь',
        default=False
    )
    details = models.JSONField(
        verbose_name='детали',
        blank=True,
        null=True
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='item_create_users',
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='item_change_users'
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
        return self.title_ru

    class Meta:
        verbose_name = 'объявление'
        verbose_name_plural = 'объявления'
        ordering = ('-date_of_creation', )


class ItemFile(models.Model):
    """
    Item file model
    """
    item = models.ForeignKey(
        verbose_name='объявление',
        to=Item,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file = models.FileField(
        verbose_name='файл',
        upload_to='files/items/'
    )

    def __str__(self):
        return f"Файл - {self.item}"

    class Meta:
        verbose_name = 'файл объявления'
        verbose_name_plural = 'файлы объявлений'


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
        max_length=300,
        blank=True,
        null=True
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300,
        blank=True,
        null=True
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300,
        blank=True,
        null=True
    )
    text_kk = models.TextField(
        verbose_name='описание на казахском',
        blank=True,
        null=True
    )
    text_ru = models.TextField(
        verbose_name='описание на русском',
        blank=True,
        null=True
    )
    text_en = models.TextField(
        verbose_name='описание на английском',
        blank=True,
        null=True
    )
    data = models.JSONField(
        verbose_name='json данные',
        blank=True,
        null=True
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='info_create_users'
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='info_change_users'
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
        return self.title_ru

    class Meta:
        verbose_name = 'новость'
        verbose_name_plural = 'новости'


class InfoFile(models.Model):
    """
    Info file model
    """
    info = models.ForeignKey(
        verbose_name='новость',
        to=Info,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file = models.FileField(
        verbose_name='файл',
        upload_to='files/info/'
    )

    def __str__(self):
        return f"Файл - {self.info}"

    class Meta:
        verbose_name = 'файл новости'
        verbose_name_plural = 'файлы новостей'


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
        max_length=300,
        blank=True,
        null=True
    )
    title_ru = models.CharField(
        verbose_name='наименование на русском',
        max_length=300,
        blank=True,
        null=True
    )
    title_en = models.CharField(
        verbose_name='наименование на английском',
        max_length=300,
        blank=True,
        null=True
    )
    data = models.JSONField(
        verbose_name='json данные',
        blank=True,
        null=True
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='test_create_users'
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='test_change_users'
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


class TestResult(models.Model):
    """
    Test result model
    """
    test = models.ForeignKey(
        verbose_name='тест',
        to=Test,
        on_delete=models.CASCADE
    )
    data = models.JSONField(
        verbose_name='json данные',
        blank=True,
        null=True
    )
    create_user = models.ForeignKey(
        verbose_name='кем создан',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='test_result_create_users'
    )
    change_user = models.ForeignKey(
        verbose_name='кем изменен',
        to=get_user_model(),
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='test_result_change_users'
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
        return f"Резултаты теста {self.test}"

    class Meta:
        verbose_name = 'результат теста'
        verbose_name_plural = 'результаты теста'


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


class Comment(models.Model):
    """
    Comment model
    """
    user = models.ForeignKey(
        verbose_name='пользователь',
        to=get_user_model(),
        on_delete=models.RESTRICT
    )
    text = models.CharField(
        verbose_name='текст сообщения',
        max_length=2000
    )
    item = models.ForeignKey(
        verbose_name='объявление',
        to=Item,
        on_delete=models.RESTRICT,
        null=True,
        blank=True
    )
    about = models.BooleanField(
        verbose_name='обратная связь',
        default=False
    )

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'комментарий пользователя'
        verbose_name_plural = 'комментарии пользователей'
