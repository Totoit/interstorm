from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.generic.dates import DayArchiveView
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import CsrfViewMiddleware
from django.utils import  translation
import os


class ArticleDayArchiveView(DayArchiveView):
    queryset = User.objects.all()
    date_field = "pub_date"
    allow_future = True


def home(request):
    template = 'home/home.html'

    return render(request, template)

def sports(request):
    template = 'sports/home.html'

    return render(request, template, {'data': ''})

def live_betting(request):
    template = 'live_betting/home.html'

    return render(request, template, {'data': ''})

def casino(request):
    template = 'casino/home.html'

    return render(request, template, {'data': ''})

def live_casino(request):
    template = 'live_casino/home.html'

    return render(request, template, {'data': ''})

def promotions(request):
    template = 'promotions/home.html'

    return render(request, template, {'data': ''})

def wheel(request):
    template = 'wheel/wheel.html'

    return render(request, template, {'data': ''})

def register(request):
    template = 'home/home.html'
    context = User.objects.all()

    return render(request, template, {'data': context})

def game_screen(request,slug):
    template = 'dashboard/game/game-screen.html'
    context = {
        'slug' : slug,
        'realMode':False
    }
    return render(request, template, context)

def handler404(request):
    return render(request, '404.html')

@csrf_exempt
def check_mobile_number(request):
    if request.method == 'POST':
        mobile_number = request.POST.get('mobile_number');

        if (User.objects.exclude().filter(telephone=mobile_number).exists()) :
            return JsonResponse({'status':False})

        return JsonResponse({'status':True})

@csrf_exempt
def syncgames(request):
    if(request.method == 'POST'):
        filename = request.POST['filename']
        myJSON = request.POST['myJSON']
        # print ('----->>',filename,myJSON.encode('utf-8'))
        # /var/www/uniclub/app/static/json
        
        if(os.name == 'nt'):
            f = open("./static/json/"+filename+".json", "wb")
        elif(os.name == 'posix'):
            f = open("/var/www/uniclub/app/static/json/"+filename+".json", "wb")
        f.write(myJSON.encode('utf-8'))
        return HttpResponse("success")
    else:
        return HttpResponse("fail")

@csrf_exempt
def readGamesData(request):
    if(request.method == 'POST'):
        filename = request.POST['filename']
        # /var/www/uniclub/app/static/json
        # with open("./static/json/"+filename+'.json', 'rb') as myfile:
        if(os.name=='nt'):
            with open("./static/json/"+filename+'.json', 'rb') as myfile:
                data=myfile.read()
        elif(os.name=='posix'):
            with open("/var/www/aurum/app/static/json/"+filename+'.json', 'rb') as myfile:
                data=myfile.read()
            # print(data)
        return HttpResponse(data)
    else:
        return HttpResponse("fail")


@csrf_exempt
def reload_uwsgi(request):
    cmd = 'sudo bash /reload_uwsgi.sh'
    os.system(cmd)
    return HttpResponse("success")