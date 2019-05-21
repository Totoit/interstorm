from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
# from site_settings.models import vendor
import json
# Create your views here.
def update_game(request):
    template = loader.get_template('dashboard/admin/settings/change_list.html')
    context = {'var1':'var1'}
    # r = render_to_response('dashboard/admin/settings/change_list.html')
    return HttpResponse(template.render(context,request))

@csrf_exempt
def update_vendor(request):
    if(request.method == 'POST'):
        print(request.POST.get('id'))
        if(request.POST.get('id') == None):
            # from pprint import pprint
            # pprint(str(request.POST))
            for vendors in request.POST.getlist('vendors[]') : 
                print (vendors)
                if not(vendor.objects.filter(vendor_name = str(vendors)).exists()):
                    # print ("not exists")
                    vendors_data = vendor(vendor_name = str(vendors))
                    vendors_data.save()
            return HttpResponse("update done")
    else:
        return HttpResponse("Only POST")

def get_vendor(request):
    if(request.method == 'POST'):
        if(request.POST.get('id') == None):
            vendors_obj_list = vendor.objects.all()
            for i in range (len(vendors_obj_list)):
                vendor_array[i] = vendors_obj_list[i].vendor_name
                nl_mark_array[i] = vendors_obj_list[i].nl_mark
            vendor_json = json.dumps(vendor_array)
            nl_mark_json = json.dumps(nl_mark_array)
            context = {
                'vendors' : vendor_json,
                'nl_mark' : nl_mark_json,
            }
            return HttpResponse (context)
        else:
            if (vendor.objects.filter(vendor_name = id).exists()):
                vendors_obj_list = vendor.objects.filter(vendor_name = id)
                vendor = vendors_obj_list[0].vendor_name
                nl_mark = vendors_obj_list[0].nl_mark
                context = {
                    'vendor' : vendor,
                    'nl_mark' : nl_mark,
                }
                return HttpResponse (context)
            else:
                return HttpResponse ("Send with wrong vendor name")
    else:
        HttpResponse ("Use Only Post Method.")