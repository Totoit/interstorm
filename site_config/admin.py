from django.contrib import admin
from site_config.models import SiteConfig
from django.contrib.auth.models import User
# Register your models here.
@admin.register(SiteConfig)
class SiteConfig(admin.ModelAdmin):
    fields = ('url','domain')
    list_display = ('url','domain')

    # def has_add_permission(self, request, obj=None):
    #     return False

    # def has_delete_permission(self, request, obj=None):
    #     return False

    def get_queryset(self, request):
        qs = super(SiteConfig, self).get_queryset(request)
        if request.user.is_superuser:
            self.fields = ('url','domain','vendor')
            self.list_display = ('url','domain','vendor')
            self.search_fields = ('vendor')
            return qs
        return qs.filter(vendor=request.user.id)
    
    
    def save_model(self, request, obj, form, change): 
        obj.vendor = User(id=request.user.id)
        obj.save()