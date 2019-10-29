from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class InterStormUserVendor(models.Model):
    name = models.CharField(max_length=200)
    usercode = models.CharField(max_length=200)
    username = models.CharField(max_length=200,primary_key=True)
    # password = models.CharField(max_length=200)

    date_start =  models.DateTimeField(default=timezone.now)
    date_expire =  models.DateTimeField(default=timezone.now)

    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=False)

    created_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.usercode