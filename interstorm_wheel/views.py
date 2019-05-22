from django.shortcuts import render
from django.http import HttpResponse
import datetime
from django.views.decorators.cache import never_cache
# Create your views here.
@never_cache
def index(request):
    template = './home.html'
    context = {}
    context['time'] = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    return render(request, template, context)