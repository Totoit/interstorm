from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from requests import request

from . import views

urlpatterns = [
    url(r'^spin$', csrf_exempt(views.spin), name='spin'),
    url(r'^get_position$', views.get_position, name='get_position'),
    url(r'^get_spins$', views.get_spins, name='get_spins'),
    url(r'^get_last_transaction$', views.get_last_transaction, name='get_last_transaction'),
    url(r'^notifications$',views.get_notifications, name='get_notifications'),
    url(r'^deposit$',views.get_deposit, name='get_deposit')
    # url(r'^get_bonus_code_inbox$', views.get_bonus_code_inbox, name='get_bonus_code_inbox'),
    
    # url(r'^getGrantedBonuses', csrf_exempt(views.getGrantedBonuses), name='getGrantedBonuses'),
]