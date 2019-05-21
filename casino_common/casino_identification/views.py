import pytz
from django.views.decorators.csrf import csrf_exempt
from .models import VerifyUser
from django.http import JsonResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext
from .forms import VerifyUserFrom

import datetime


@csrf_exempt
def verificationView(request):
    # Handle file upload
    documents = VerifyUser.objects.filter(user=request.user.id)

    if request.method == 'POST':

        newdoc = VerifyUser(docfile=request.FILES['docfile'], mode_id=request.POST['mode'])

        newdoc.user_id = request.user.id
        newdoc.createDate = datetime.datetime.now().replace(tzinfo=pytz.utc)
        newdoc.modifyDate = datetime.datetime.now().replace(tzinfo=pytz.utc)
        newdoc.approve = False
        checkimg = VerifyUser.objects.filter(user_id = request.user.id,mode_id = newdoc.mode)

        if checkimg.count() > 0 :
            checkimg.delete()
        # print request.FILES['docfile']
        newdoc.save()

        # return HttpResponseRedirect('/')
        # return HttpResponseRedirect(reverse('identification'))
        return HttpResponseRedirect('/account/identification/')
        # return render(request,'dashboard/account/identification.html',{'documents': documents})
    else:
        photo_form = VerifyUserFrom(auto_id=False, initial={'mode': 'PID', 'user': request.user})  # A empty, unbound form
        address_form = VerifyUserFrom(auto_id=False, initial={'mode': 'PROOF_OF_ADRESS', 'user': request.user})
        payment_form = VerifyUserFrom(auto_id=False, initial={'mode': 'PAYMENT_METHOD', 'user': request.user})

        # return render_to_response(
        #     'dashboard/account/identification.html',
        #     { 'photo_form': photo_form, 'address_form': address_form,
        #      'payment_form': payment_form,'documents':documents},
        #     context_instance=RequestContext(request)
        # )
        #
        return render(request,  'dashboard/account/identification.html', {'photo_form': photo_form, 'address_form': address_form,
             'payment_form': payment_form, 'documents': documents})
