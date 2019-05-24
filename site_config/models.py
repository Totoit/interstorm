from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.
class SiteConfig(models.Model):
    url = models.TextField()
    domain = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)