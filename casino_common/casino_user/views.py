# coding=utf-8
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django import template
from . import get_user
register = template.Library()


try:
    # Python 3
    import urllib.request as urllib
except ImportError:
    # Python 2
    import urllib2 as urllib


@csrf_exempt
def login_cms(request):
    if request.method == 'POST':
        this_user = get_user.user()
        if request.POST.get('auth'):
            result = this_user.authen_user(request, request.POST.get('username'), request.POST.get('email'), request.POST.get('firstname'))

        response = {
            'result': None
        }

    return JsonResponse(response)


@csrf_exempt
def logout_cms(request):
    if request.method == 'POST':
        this_user = get_user.user()
        if (this_user.is_authenticated(request)) and (not this_user.is_superuser(request)):
            result = this_user.logout(request)
            response = {
                'result': True
            }
        else:
            response = {
                'result': False
            }

    return JsonResponse(response)

