from django.apps import AppConfig


class AuthsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auths'
    verbose_name = 'пользователи'

    def ready(self) -> None:
        import auths.signals
