from django.contrib import admin
from interstorm_wheel.models import test_db,WheelPercentage,WheelBonusCode,WheelImageLevel
from django.contrib.auth.models import User

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


@admin.register(WheelImageLevel)
class WheelAdminImageLevel(admin.ModelAdmin):
    fields = ('image','level')
    list_display = ('level','image')
    ordering = ('level',)

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        qs = super(WheelAdminImageLevel, self).get_queryset(request)
        if request.user.is_superuser:
            self.list_display = ('level','image','vendor')
            # self.fields = ['name', 'detail','create_by']
            # self.readonly_fields = ['create_by']
            self.search_fields = ('vendor')
            return qs
        return qs.filter(vendor=request.user.id)

    def save_model(self, request, obj, form, change): 
        obj.vendor = User(id=request.user.id)
        obj.save()

    