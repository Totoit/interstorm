from django.conf.urls import url,include
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from . import views
urlpatterns = [
    url(r'^$', views.login),
    url(r'^game', views.index),
    url((r'^api/'),include([
        url(r'^spin$', csrf_exempt(views.spin), name='spin'),
        url(r'^get_spins$', views.get_spins, name='get_spins'),
        url(r'^get_last_transaction$', views.get_last_transaction, name='get_last_transaction'),
        url(r'^get_bonus_code$', views.get_bonus_code, name='get_bonus_code'),
        url(r'^get_wheel_image$', views.get_wheel_image, name='get_wheel_image'),
    ]))
]
