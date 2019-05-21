from django.conf.urls import url, include
from django.contrib.auth.views import logout

from . import views

urlpatterns = [
    url(r'^logincms', views.login_cms, name='logincms'),
    url(r'^logoutcms', views.logout_cms, name='logoutcms'),
]