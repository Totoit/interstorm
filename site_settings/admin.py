from django.contrib import admin
from site_settings.models import ContractSetting,AutoEmail
from site_settings.models import SyncGame #,vendor
from site_settings.forms import AutoEmailAdminForm
from cms.admin.placeholderadmin import PlaceholderAdminMixin
from hvad.admin import TranslatableAdmin

from django.template.response import TemplateResponse
from django.conf.urls import url, include


from site_settings import views as site_settingsViews
# Register your models here.
class ContractSettingAdmin(admin.ModelAdmin):
    try:
        temp_list = ContractSetting.objects.all()
        if(len(temp_list)==0):
            temp_data = ContractSetting()
            temp_data.save()
    except:
        print("Critical Warning !!\n--- python manage.py makemigrations site_settings---")
    def has_add_permission(self,request,obj=None):
        return False

class AutoEmailAdmin(TranslatableAdmin, PlaceholderAdminMixin, admin.ModelAdmin):
    form = AutoEmailAdminForm
    #list_display = ('title')

class GameGetFromMatrix(admin.ModelAdmin):

    # change_list_template = 'dashboard/admin/contract_management/UserContractStatus/change_list.html'
    change_list_template = 'dashboard/admin/settings/update_game_template.html'

    def has_add_permission(self, request):
        return False
    def has_delete_permission(self, request):
        return False
    # def has_change_permission(self, request):
    #     return False
    def save_model(self, request, obj, form, change):
        pass
    def delete_model(self, request, obj):
        pass
    def save_related(self, request, form, formsets, change):
        pass

class VendorAdmin(admin.ModelAdmin):
    change_list_template = 'dashboard/admin/settings/update_vender_template.html'
    list_display = ('vendor_name','nl_mark')
    readonly_fields = ['vendor_name']
    def has_add_permission(self,request):
        return False
    def had_delete_permission(self,request):
        return False

# admin.site.register(AutoEmail,GameGetFromMatrix)
# admin.site.register(AutoEmail,AutoEmailAdmin)
# admin.site.register(ContractSetting,ContractSettingAdmin)
admin.site.register(SyncGame,GameGetFromMatrix)
# admin.site.register(vendor,VendorAdmin)