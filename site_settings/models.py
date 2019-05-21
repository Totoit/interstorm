from django.db import models
from hvad.models import TranslatableModel, TranslatedFields
from hvad.manager import TranslationManager
from django.utils import timezone

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your models here.
class ContractSetting (models.Model):
    class Meta:
        db_table = 'site_setting_contract_setting'

    email_user = models.CharField(max_length=255, default='-')
    email_password = models.CharField(max_length=255, default='-')
    email_server = models.CharField(max_length=255, default='-')
    email_port = models.IntegerField(default=587)
    email_of_support =models.CharField(max_length=255, default='-')

    def __str__(self):
        return self.email_server


class AutoEmailQuerySet(models.QuerySet):
	def published(self, date=None):
		if not date:
			date = timezone.now()

		return self.filter(
			models.Q(publish_date__lte=date),
			models.Q(expire_date__isnull=True) | models.Q(expire_date__gt=date),
		)

class AutoEmailManager(TranslationManager):
	queryset_class = type('CampaignTranslationQueryset',
		(AutoEmailQuerySet, TranslationManager.queryset_class), {})
	fallback_class = type('CampaignFallbackQueryset',
		(AutoEmailQuerySet, TranslationManager.fallback_class), {})
	default_class = AutoEmailQuerySet

class AutoEmail(TranslatableModel):

	class Meta:
		db_table = 'site_setting_auto_email'
    
	objects = AutoEmailManager()
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	email_for = models.CharField(max_length=255,default='-')

	translations = TranslatedFields(
		
		title = models.CharField('title', max_length=255, default='-'),
		body = models.TextField('body'),
		lang_code = models.CharField('lang_code', max_length=10, default='EN')
	)

	def __str__(self):
		title = 'no title'
		if(AutoEmail.objects.language('en').filter(master_id=self.id).exists()):
			temp = AutoEmail.objects.language('en').filter(master_id=self.id)
			title = temp[0].title
			#print ('---------------',title)
		return title

class SyncGame(models.Model):
	mockin_table = models.CharField(max_length=255,default='-')
	class Meta:
		db_table = 'site_setting_sync_games'
    
# class vendor(models.Model):
# 	class Meta:
# 		db_table = 'site_setting_vendor'
# 	vendor_name = models.CharField(max_length=255,default='')
# 	nl_mark = models.CharField(max_length=255,default='000000')
# 	updated_times = models.DateTimeField(auto_now_add=True)

