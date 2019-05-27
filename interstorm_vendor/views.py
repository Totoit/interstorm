from django.shortcuts import render

# Create your views here.
from site_config.models import SiteConfig
from interstorm_vendor.models import InterStormUserVendor

from django.http import HttpResponse

def get_game_api(request):
    code = 'JPAY8D'
    print(InterStormUserVendor.objects.get(usercode = code).user_id)
    domain = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = code).user_id).domain)
    url = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = code).user_id).url)

    return HttpResponse(domain+"<br>"+url)