from django.apps import AppConfig


class AppUConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_u'

    def ready(self):
        import app_u.signals  # Import the signals
