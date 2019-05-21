from django.conf import settings
from django.shortcuts import render
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.template import loader
from contract_management.models import TermAndCondition, UserContract
from django.shortcuts import redirect
from wsgiref.util import FileWrapper
import datetime


# Create your views here.
from . import views
from reportlab.pdfgen import canvas

from django.contrib.sessions.models import Session
from django.contrib.auth.models import User

import requests
import json
import os

#for file path
def changeWord(realWord):
    temp = list(realWord)
    temp2 = []
    loop = len(temp)
    for i in range (loop):
        if (temp[i] == ""'/'"" ):
            temp[i]= "\\"
        if(i>0):
            temp2.append(temp[i])
    return "".join(temp2)

def eSignature_onClick(request):
    log = ("Genarate PDF")
    print (log)

    #Get contract Data from DB
    termandcondition_list = TermAndCondition.objects.all()
    termAndCondition_text = str(termandcondition_list[0].Term_And_Condition_Details)

    User = request.user
    import datetime
    nowtime = datetime.datetime.now()
    timedmy = nowtime.strftime("%d-")+nowtime.strftime("%m-")+nowtime.strftime("%Y")
    timehours = nowtime.strftime("%H_") + nowtime.strftime("%M_") + nowtime.strftime("%S")

    timemdy = nowtime.strftime("%m/")+nowtime.strftime("%d/")+nowtime.strftime("%Y")

    time = str(timedmy)+" "+str(timehours)

    #time_t = datetime.datetime.strptime(nowtime,'%d/%m/%Y %H:%M:%s')
    #string_time = str(time)

    fileName = str(User) +"_"+ str(time)+".pdf"
    
    fileLocation = "./assets/contracts/"
    fileLocationToDB = fileLocation[1:len(fileLocation)]
    #เผื่ออนาคตทำ browse file
    fileLink = fileLocation + fileName

    filePDF = canvas.Canvas(fileLink)
    filePDF.drawString(100,750,""+termAndCondition_text)
    filePDF.save()

    #Save to DB
    #import os 
    #fullLocation = os.getcwd()

    defaultStatus = 'active'

    userContract = UserContract(FileName=fileName,FileLocation=fileLocationToDB,username=User,date_modify=nowtime,status = defaultStatus)
    userContract.save()

    log = ("Done")
    print(log)

    return "<br>pdf Created ! path = " + "assets/contracts/"+ str(User) + str(time) +".pdf" +"<br> "


def index(request):
    meta_html = '<meta http-equiv="refresh" content="0; url=/account" />'
    try:
        user = request.user
        log = eSignature_onClick(request)
    except:
        return HttpResponse(meta_html)


    # session_key = request.session.session_key
    
    # session = Session.objects.get(session_key=session_key)
    # uid = session.get_decoded().get('_auth_user_id')
    # user = User.objects.get(pk=uid)

    # print (uid,user.username, user.get_full_name(), user.email)
    return HttpResponse(meta_html)

def dateTimeFormat(date):
    datetime_str = datetime.datetime.strftime(date,'%d-%m-%Y')
    return datetime_str


def getContractUserData(request):
    try:
        username = request.user
        data = UserContract.objects.filter(username=username)
        fileName = data[0].FileName
        user = data[0].username
        fileLocation = data[0].FileLocation
        date = data[0].date_modify
        datetime_str = dateTimeFormat(date)
        status = data[0].status

        admin_data = checkAdminStatus()
        diable_flag = '0'
        for item in admin_data:
            if(item['role'] == 'agent' and item['online_status'] == 'N'):
                diable_flag = '1'

        contract_data = {
            'user': user,
            'fileName': fileName,
            'fileLocation': fileLocation,
            'date': datetime_str,
            'status': status,
            'admin_status':diable_flag
        }
    #print (contract_data)
        return render(request,"dashboard/account/home.html",contract_data)
    except:
        contract_data = {
            'fileName': 'None',
            'admin_status':'0'
        }
        return render(request,"dashboard/account/home.html",contract_data)
    
    #function check admin status
def checkAdminStatus():
        #check for see admin online or not 
    url = 'https://uniclubcasino.ladesk.com/api/v3/agents/?_page=1&_perPage=10&_sortDir=ASC'
    headers = {'apikey' : '39002d020e7b90539183dc8db10526ed'}
    r = requests.get(url,headers=headers)
    #print (r.text) 
    #print (r.json())
    json_text = r.json()
    return json_text

def generateFileData(request):
    username = request.user
    data = UserContract.objects.filter(username=username)
    fileName = data[0].FileName
    fileLocation = data[0].FileLocation
    url = '.'+fileLocation + fileName
    return url

def OpenPDFFile(request):
    try:
        url = generateFileData(request)
        pdf_data = open(url, 'rb').read()
        request.META.get('HTTP_{Term And Condition File}')
        return HttpResponse(pdf_data, content_type='application/pdf')
    except:
        return HttpResponse("ERROR 404 not found")

def DownloadPDFFile(request):
    try:
        username = request.user
        data = UserContract.objects.filter(username=username)
        fileName = data[0].FileName
        fileLocation = data[0].FileLocation

        f = open('.'+fileLocation+fileName,"r")
        path = os.path.expanduser('~'+fileLocation)
        response = HttpResponse(FileWrapper(f), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename='+fileName
        f.close
        return response
    except:
        return HttpResponse("ERROR 404 not found")