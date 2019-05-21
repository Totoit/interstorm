from cms.admin.placeholderadmin import PlaceholderAdminMixin
# from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from hvad.admin import TranslatableAdmin

from casino_campaigns.forms import CampaignAdminForm
from casino_campaigns.models import Campaign

# from contract_management.models import TermAndCondition #,UserContract




class CampaignAdmin(TranslatableAdmin, PlaceholderAdminMixin, admin.ModelAdmin):
	form = CampaignAdminForm
	list_display = ('__str__', 'publish_date', 'expire_date','landing_page','is_published','show_bottom_banners')
	list_filter = (('landing_page', admin.BooleanFieldListFilter),)
	actions = ('action_publish_campaigns', 'action_unpublish_campaigns')

	

	def get_prepopulated_fields(self, request, obj=None):
		return {'slug': ('title',)}

	def get_fieldsets(self, request, obj=None):
		url = request.path
		if(Campaign.objects.filter(show_bottom_banners=True).exists()):
			print(url)
			array = url.split('/')
			print(array[4])
			if(array[4].isnumeric()):
				CampaignTemp = Campaign.objects.filter(id=array[4])
				print(CampaignTemp[0].show_bottom_banners)
				if(CampaignTemp[0].show_bottom_banners):
					return (
					(None, {
						'fields': ('banner_cover', 'title' , 'subtitle','detail', 'topic' , 'topic_data','thumbnail',),
					}),
					(_('Advanced'), {
						'fields': ('slug','cta','show_slide','show_bottom_banners','landing_page', 'publish_date', 'expire_date'),
					})
				)
				else:
					return (
					(None, {
						'fields': ('banner_cover', 'title' , 'subtitle','detail', 'topic' , 'topic_data','thumbnail',),
					}),
					(_('Advanced'), {
						'fields': ('slug','cta','show_slide','landing_page', 'publish_date', 'expire_date'),
					})
				)
			else:
				return (
					(None, {
						'fields': ('banner_cover', 'title' , 'subtitle','detail', 'topic' , 'topic_data','thumbnail',),
					}),
					(_('Advanced'), {
						'fields': ('slug','cta','show_slide','landing_page', 'publish_date', 'expire_date'),
					})
				)
		else:
			return (
				(None, {
					'fields': ('banner_cover', 'title' , 'subtitle','detail', 'topic' , 'topic_data','thumbnail',),
				}),
				(_('Advanced'), {
					'fields': ('slug','cta','show_slide','show_bottom_banners','landing_page', 'publish_date', 'expire_date'),
				})
			)

	# def get_list_display(self, request):
	# 	list_display = super(CampaignAdmin, self).get_list_display(request)
	#
	# 	def language_method(self, obj):
	# 		return True
	# 	language_method
	#
	# 	for k, v in settings.LANGUAGES:
	#
	#
	# 	return list_display

	def is_published(self, campaign):
		return campaign.is_published
	is_published.short_description = _('is published')
	is_published.boolean = True

	def action_publish_campaigns(self, request, queryset):
		queryset = queryset.filter(Q(publish_date__isnull=True) | Q(publish_date__lt=timezone.now()))
		queryset.update(publish_date=timezone.now(), expire_date=None)
	action_publish_campaigns.short_description = _('Publish selected unpublished campaigns')

	def action_unpublish_campaigns(self, request, queryset):
		queryset.published().update(expire_date=timezone.now())
	action_unpublish_campaigns.short_description = _('Unpublish selected published campaigns')

#for control Contract //remove ปุ่ม add by Tae 11-dec-2018
# class ContractDetailAdmin(admin.ModelAdmin):
# 	def has_add_permission(self,request,obj=None):
# 		return False
# 	def has_delete_permission(self,request,obj=None):
# 		return False

# #เพิ่ม ContractDetail ในหน้า admin by Tae 11-dec-2018 ห้ามลบ เพิ่มได้ถ้าไม่มี contract 
# try:
# 	contractChkAdd = len(TermAndCondition.objects.all())
# 	#print (contractChkAdd)
# 	if (contractChkAdd == 0):
# 		Term_And_Condition_Details = TermAndCondition(Term_And_Condition_Details='blank')
# 		Term_And_Condition_Details.save()
# 	admin.site.register(TermAndCondition,ContractDetailAdmin)
# except:
# 	print ('for old DB You need to Make Migrations first use command: "\n" python manage.py makemigrations contract_management "\n" python manage.py migrate')
# 	#import sys
# 	#sys.exit()




#admin.site.register(UserContract)
admin.site.register(Campaign, CampaignAdmin)
