from cms.extensions import TitleExtension
from cms.models.fields import PlaceholderField

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from filer.fields.image import FilerImageField
from hvad.manager import TranslationManager
from hvad.models import TranslatableModel, TranslatedFields
from djangocms_text_ckeditor.fields import HTMLField

class CampaignQuerySet(models.QuerySet):
	def published(self, date=None):
		if not date:
			date = timezone.now()

		return self.filter(
			models.Q(publish_date__lte=date),
			models.Q(expire_date__isnull=True) | models.Q(expire_date__gt=date),
		)


class CampaignManager(TranslationManager):
	queryset_class = type('CampaignTranslationQueryset',
		(CampaignQuerySet, TranslationManager.queryset_class), {})
	fallback_class = type('CampaignFallbackQueryset',
		(CampaignQuerySet, TranslationManager.fallback_class), {})
	default_class = CampaignQuerySet


class Campaign(TranslatableModel):
	class Meta:
		verbose_name = _('campaign')
		verbose_name_plural = _('campaigns')
		app_label = 'casino_campaigns'
		unique_together = ('language_code', 'slug')

	objects = CampaignManager()

	translations = TranslatedFields(
		title=models.CharField(_('title'), max_length=60),
		subtitle=HTMLField(_('subtitle')),
		detail=HTMLField(_('detail')),
		topic=models.CharField(_('topic'), max_length=60),
		topic_data=HTMLField(_('content')),
		cta=models.CharField(_('cta'), max_length=60),
		slug=models.SlugField(),
		image=FilerImageField(null=True,verbose_name=_('image'),help_text="recommend size 1970 * 543 or ration 21:9"),
		thumbnail=FilerImageField(verbose_name=_('thumbnail'),related_name = 'thumbnail_casino_campaign',help_text="recommend size 540 * 400"),
		banner_cover=FilerImageField(verbose_name=_('Banner cover'),related_name ='banner_image_casino_campaign',help_text="recommend size 1920 * 440"),
	)
	
	show_slide = models.BooleanField()
	show_bottom_banners = models.BooleanField(default = False)
	landing_page = models.BooleanField()
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	publish_date = models.DateTimeField(_('publish date'), null=True, blank=True, default=None)
	expire_date = models.DateTimeField(_('expire date'), null=True, blank=True, default=None)

	content = PlaceholderField('campaign_content', related_name='campaign_content')


	@models.permalink
	def get_absolute_url(self):
		return 'casino_campaigns:detail', [self.lazy_translation_getter('slug')]

	def __str__(self):
		return self.lazy_translation_getter('title')

	@property
	def is_published(self):
		now = timezone.now()

		if self.publish_date is None:
			return False

		return self.publish_date <= now and (self.expire_date is None or self.expire_date >= now)
