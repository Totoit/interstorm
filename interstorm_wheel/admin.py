from django.contrib import admin
from interstorm_wheel.models import test_db
from django.contrib.auth.models import User

class test_data_Admin(admin.ModelAdmin):

    list_display = ('name', 'detail',)
    fields = ['name', 'detail',]
    readonly_fields = ['create_by']

    list_filter = ('name','detail','create_by')

    def get_queryset(self, request):
        qs = super(test_data_Admin, self).get_queryset(request)
        print (request.user.id)
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