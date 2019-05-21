from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from app import settings


class user:
    def __init__(self):
        self.user = User
    def is_authenticated(self,request):
        return request.user.is_authenticated()

    def is_superuser(self,request):
        # print request.user.is_superuser
        return request.user.is_superuser

    def authen_user(self,request,username,email,firstname):
        password = 'StageWilly'
        if (not User.objects.exclude().filter(username=username).exists()) :
            regi = User.objects.create_user(username, email, password)
            regi.first_name = firstname
            regi.save()

        self.user = authenticate(username=username, password=password)
        # print self.user.is_authenticated()
        if self.user is not None:
            if self.user.is_active:
                auth_login(request, self.user)
                return HttpResponseRedirect(request.GET.get('next',
                                                            settings.LOGIN_REDIRECT_URL))
        else:
            error = "Invalid username or password."

    def logout(self, request):

        auth_logout(request)
        return HttpResponseRedirect(request.GET.get('next',
                                                    settings.LOGIN_REDIRECT_URL))


