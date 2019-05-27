from django import forms
from django.contrib.auth.models import User
from interstorm_vendor.models import InterStormUserVendor
from django.utils import timezone
import random 

# 48-57
# not 58-64
# 65 - 90


class InterStormUserVendorForm(forms.Form):

    name = forms.CharField(label='Name', max_length=255)
    username = forms.CharField(label='Username', max_length=255)
    password = forms.CharField(label='Password', max_length=255)
    
    

    def save(self, commit=True):
        instance = super(InterStormUserVendorForm, self).save(commit=False)

        #Create User
        if(User.objects.filter(username=self.username).exist()):
            print("exist username")

        else:
            password = User.objects.make_random_password(str(self.password))
            UserObject = User(is_superuser=False,is_staff=1,is_active=1,username = self.username)
            UserObject.set_password(password)
            UserObject.save()

            random_code = ''
            for i in range(0,6):
                n = random.randint(48,90)
                while(n<58 and n>64):
                    n = random.randint(48,90)
                ch = str(chr(n))
                random_code = random_code+ch

            InterStormUserVendorObject = InterStormUserVendor(name = self.name,usercode=random_code,created_date = timezone.now,udpated_date = timezone.now)

        if commit:
            instance.save()
        return instance