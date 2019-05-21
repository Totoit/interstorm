import os

import pytz
from django.db import models
from django.contrib.auth.models import User
from private_storage.fields import PrivateFileField
from datetime import datetime

class MasterData(models.Model):
    modeid = models.AutoField(primary_key=True,)
    groupname = models.CharField(max_length=50,null=True)
    modename = models.CharField(max_length=50)
    modedesc = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    createDate = models.DateTimeField(default=datetime.now, blank=True)
    modifyDate = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return '%s'% self.modedesc

class VerifyUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mode = models.ForeignKey(MasterData)
    docfile = PrivateFileField("File")
    docnumber = models.IntegerField(default=0)
    docexpiry = models.DateTimeField(default=datetime.now().replace(tzinfo=pytz.utc), blank=True)
    neverexpiry = models.BooleanField(default=False)
    approve = models.BooleanField(default=False)
    approve_by =  models.ForeignKey(User,related_name= 'approve_by',blank=True,null=True)
    createDate = models.DateTimeField(default=datetime.now().replace(tzinfo=pytz.utc), blank=True)
    modifyDate = models.DateTimeField(default=datetime.now().replace(tzinfo=pytz.utc), blank=True)

    def __str__(self):
        return '%s'% self.user

    def save(self, *args, **kwargs):
        self.modifyDate = datetime.now().replace(tzinfo=pytz.utc)
        super(VerifyUser, self).save(*args, **kwargs)

    def filename(self):
        return os.path.basename(self.docfile.name)


