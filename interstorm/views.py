import os
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def reload_uwsgi(request):
    cmd = 'sudo bash /reload_uwsgi.sh'
    os.system(cmd)
    return HttpResponse("success")