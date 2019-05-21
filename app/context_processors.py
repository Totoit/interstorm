from django.conf import settings


def app_settings(request):
    return {
        'TERM_OF_CONDITION_PAGE_ID': getattr(settings, 'TERM_OF_CONDITION_PAGE_ID', None),
        'EVERYMATRIX': getattr(settings, 'EVERYMATRIX', {}),
        'CAPTCHA_KEY': getattr(settings, 'CAPTCHA_KEY', {}),
        'SITE_NAME': getattr(settings, 'SITE_NAME', {}),
    }
