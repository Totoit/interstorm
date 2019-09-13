from django.conf.urls import url, include
from solid_i18n.urls import solid_i18n_patterns
from translation_manager import urls as translation_urls
from .urls import *

urlpatterns += solid_i18n_patterns(url(r'^django-rq/', include('django_rq.urls')),
                                   url(r'^translations/', include(translation_urls)),
                                   )