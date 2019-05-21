from django.forms import ModelForm
from django import forms
from .models import VerifyUser,MasterData
from django.contrib import admin
class MasterDataAdmin(admin.ModelAdmin):
    model = MasterData
    list_display = ['groupname', 'modename', 'active', 'modifyDate']


admin.site.register(MasterData,MasterDataAdmin)
class VerifyUserFrom(ModelForm):
    hasUser = forms.FileField()
    def __init__(self, *args, **kwargs):
        if args.__len__() == 0 :
            # select mode
            if 'mode' in kwargs['initial']:
                self.mode = MasterData.objects.filter(modename=kwargs['initial'].pop('mode'),groupname='Identification').values_list('modeid', flat=True)[0]
            if 'user' in kwargs['initial']:
                self.hasUser = VerifyUser.objects.filter(mode=self.mode,user=kwargs['initial'].pop('user').id)

            super(VerifyUserFrom, self).__init__(*args, **kwargs)
            self.fields['mode'].initial =  self.mode

            self.fields['docfile'].widget.attrs.update({'class': 'box__file'})
            self.fields['docfile'].widget.attrs.update({'id':   MasterData.objects.filter(modeid=self.mode).values_list('modename', flat=True)[0]})
            self.fields['docfile'].widget.attrs.update({'data-multiple-caption': '{count} files selected'})
            self.fields['docfile'].widget.attrs.update({'multiple': ''})
            # self.fields['docfile'].
            # if self.hasUser.__len__() > 0 :
            #     self.fields['docfile'].disabled = True

    class Meta:
        model = VerifyUser
        fields = ['user', 'mode', 'approve', 'docfile']

