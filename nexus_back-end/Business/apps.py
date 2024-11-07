from django.apps import AppConfig


class BusinessConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Business'

    def ready(self):
            import Business.signals
