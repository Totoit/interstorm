from django.contrib import admin
from interstorm_wheel.models import test_db,WheelPercentage,WheelBonusCode,WheelImageLevel,WheelLevelManage,WheelImageLevel
from django.contrib.auth.models import User
from django import forms

class test_data_Admin(admin.ModelAdmin):

    list_display = ('name', 'detail',)
    fields = ['name', 'detail',]
    readonly_fields = ['create_by']

    list_filter = ('name','detail','create_by')

    def get_queryset(self, request):
        qs = super(test_data_Admin, self).get_queryset(request)
        if request.user.is_superuser:
            self.list_display = ('name', 'detail','create_by')
            self.fields = ['name', 'detail','create_by']
            self.readonly_fields = ['create_by']
            return qs
        return qs.filter(create_by=request.user.id)

    def save_model(self, request, obj, form, change): 
        obj.create_by = User(id=request.user.id)
        obj.save()



# class test_data_Admin(admin.ModelAdmin):
#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.is_superuser:
#             return qs
#         return qs.filter(author=request.user)

# Register your models here.
admin.site.register(test_db,test_data_Admin)
# admin.site.register(WheelImageLevel)
admin.site.disable_action('delete_selected')

@admin.register(WheelPercentage)
class WheelAdmin(admin.ModelAdmin):
    fields = ('percent_id','level', 'rewards', 'percentage')
    list_display = ('rewards','level', 'percentage')
    ordering = ('-percentage','level')

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        return ['percent_id','rewards','level']

    def get_queryset(self, request):
        qs = super(WheelAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            self.list_display = ('rewards','level', 'percentage','vendor')
            self.fields = ('percent_id','level', 'rewards', 'percentage')
            self.search_fields = ('vendor')
            return qs
        return qs.filter(vendor=request.user.id)
    
    
    def save_model(self, request, obj, form, change): 
        obj.vendor = User(id=request.user.id)
        obj.save()

# Register your models here.
# admin.site.disable_action('delete_selected')


@admin.register(WheelBonusCode)
class WheelAdminBonus(admin.ModelAdmin):
    fields = ('winning_key','level','bonus_key', 'bonus_code')
    list_display = ('winning_key','level','bonus_key', 'bonus_code')

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        return ['winning_key','level','bonus_key']

    def get_queryset(self, request):
        qs = super(WheelAdminBonus, self).get_queryset(request)
        # print(request.user.is_superuser)
        if request.user.is_superuser:
            self.list_display = ('winning_key','level','bonus_key', 'bonus_code','vendor')
            # self.fields = ['name', 'detail','create_by']
            # self.readonly_fields = ['create_by']
            self.search_fields = ('vendor')
            return qs
        return qs.filter(vendor=request.user.id)

    def save_model(self, request, obj, form, change): 
        obj.vendor = User(id=request.user.id)
        obj.save()


# @admin.register(WheelImageLevel)
class WheelAdminImageLevel(admin.ModelAdmin):
    # fields = ('image','level')
   
    
    # def has_add_permission(self, request, obj=None):
    #     return False

    
    def get_queryset(self, request):
        print(request.user.is_superuser)
        qs = super(WheelAdminImageLevel, self).get_queryset(request)
        if request.user.is_superuser:
            self.list_display = ('level','image_tag','vendor')
            self.search_fields = ('level','vendor')
            return qs
        else:
            self.readonly_fields = ['image_tag','vendor']
            self.list_display = ('level','image_tag')
            self.ordering = ('level',)
            return qs.filter(vendor=request.user.id)

    # def save_model(self, request, obj, form, change): 
    #     obj.vendor = User(id=request.user.id)
    #     obj.save()
    def save_model(self, request, obj, form, change): 
        print(obj.image)
        if request.user.is_superuser:
            # if(WheelImageLevel.objects.filter(level=obj.level,vendor_id = obj.vendor).exists()):
                # WheelImageLevel.objects.filter(level=obj.level,vendor_id = obj.vendor).update(image = "interstorm/"+str(obj.image))
            # else:
                obj.save()
        else:
            # if(WheelImageLevel.objects.filter(level=obj.level,vendor_id = request.user.id).exists()):
                # image = form.cleaned_data['image']
                # WheelImageLevel.objects.filter(level=obj.level,vendor_id = request.user.id).update(image = "interstorm/"+str(obj.image))
                # WheelImageLevel.objects.filter(level=obj.level,vendor_id = request.user.id).update(image = image.)
            # else:
                obj.vendor = User(id=request.user.id)
                obj.save()

admin.site.register(WheelImageLevel,WheelAdminImageLevel)

# list_display = ('title','image_tag')
#     #fields = ['image_tag']
#     readonly_fields = ['image_tag']
class WheelLevelManageAdmin(admin.ModelAdmin):
    list_display = ('level','deposit')
    fields = ['level','deposit']
    readonly_fields = ['vendor',]
    def get_queryset(self, request):
        qs = super(WheelLevelManageAdmin, self).get_queryset(request)
        print(request.user.is_superuser)
        if request.user.is_superuser:
            self.list_display = ('vendor','level','deposit')
            self.fields = ['vendor','level','deposit']
            self.readonly_fields = ['',]
            return qs
        # self.readonly_fields = ['vendor',]
        return qs.filter(vendor_id=request.user.id)
        
    def save_model(self, request, obj, form, change): 
        if request.user.is_superuser:
            if(WheelLevelManage.objects.filter(level=obj.level,vendor_id = obj.vendor).exists()):
                WheelLevelManage.objects.filter(level=obj.level,vendor_id = obj.vendor).update(deposit = obj.deposit)
            else:
                obj.save()
        else:
            if(WheelLevelManage.objects.filter(level=obj.level,vendor_id = request.user.id).exists()):
                WheelLevelManage.objects.filter(level=obj.level,vendor_id = request.user.id).update(deposit = obj.deposit)
            else:
                obj.vendor = User(id=request.user.id)
                obj.save()
    
admin.site.register(WheelLevelManage,WheelLevelManageAdmin)