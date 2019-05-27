from django.contrib import admin
from interstorm_vendor.form import InterStormUserVendorForm
from django import forms
from django.contrib.auth.models import User
from interstorm_vendor.models import InterStormUserVendor
from django.utils import timezone
import random 
from django.contrib import messages

# Then, when you need to error the user:

# Register your models here.
class InterStormUserVendorAdmin(admin.ModelAdmin):
    # form = InterStormUserVendorForm
    # def save_model(self, request, obj, form, change): 
    #     obj.create_by = User(id=request.user.id)
    #     obj.save()

    list_display = ("usercode","username","date_start","date_expire")
    fields = ["usercode","name","username","date_start","date_expire"]
    readonly_fields = ['usercode']

   
    # if(InterStormUserVendor.objects.filter(usercode = forms.cleaned_data.get('usercode'))):
    #     print("x)")

    # def get_queryset(self, request):
    #     if(usercode==""):
    #         self.fields = ["usercode","name","username","password","date_start","date_expire"]
    #         self.readonly_fields = ['usercode','username',]

    def save_model(self, request, obj, form, change): 
        if(obj.usercode==""):
            print("Create new user")
            if(User.objects.filter(username=obj.username).exists()):
                print("exist username")
                messages.error(request, "exist SUPERUSER username")
            else:
                # password = User.objects.make_random_password(str(obj.password))
                # print(password)
                UserObject = User(is_superuser=False,is_staff=1,is_active=1,username = obj.username)
                UserObject.set_password(str('123456'))
                UserObject.save()
                
                UserTemp = User.objects.filter(username=obj.username)
                obj.user = User(id=UserTemp[0].id)
                random_code = ''
                for i in range(0,6):
                    n = random.randint(48,90)
                    while(n>57 and n<65):
                        n = random.randint(48,90)
                    ch = str(chr(n))
                    random_code = random_code+ch
                obj.usercode = random_code
                obj.save()
        else:
            print("Update User Data")
            obj.update_date = timezone.now
            obj.save()

admin.site.register(InterStormUserVendor,InterStormUserVendorAdmin)