from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.safestring import mark_safe
from interstorm_vendor.models import InterStormUserVendor
# Create your models here.
class test_db (models.Model):
    class Meta:
        db_table = "test_db"

    name = models.CharField(max_length=255, default='-')
    detail = models.TextField(max_length=255, default = '-')
    create_by = models.ForeignKey(User,on_delete=models.CASCADE,blank=False,)

    def __str__(self):
        return self.name

class WheelTransaction(models.Model):
    user_id = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=50)
    transaction_date = models.DateTimeField(null=True, blank=True)
    amount = models.IntegerField()
    currency = models.CharField(max_length=50)
    casino_name = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)

    def __str__(self):
        return self.transaction_id

class WheelGames(models.Model):
    user_id = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    wheel_type = models.CharField(max_length=20)
    win_result = models.CharField(max_length=200)
    win_bonus = models.CharField(max_length=200)
    win_bonuscode = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)


class WheelAccess(models.Model):
    user_id = models.CharField(max_length=200)
    level_1 = models.IntegerField()
    level_2 = models.IntegerField()
    level_3 = models.IntegerField()
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)

    

class WheelAccessLog(models.Model):
    user_id = models.CharField(max_length=200)
    ip = models.CharField(max_length=50)
    level_1 = models.IntegerField()
    level_2 = models.IntegerField()
    level_3 = models.IntegerField()
    reason = models.CharField(max_length=200, default='')
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)

class WheelPercentage(models.Model):
    percent_id = models.CharField(max_length=200)
    level = models.IntegerField()
    rewards = models.CharField(max_length=50)
    percentage = models.IntegerField()
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)

class WheelBonusCode(models.Model):
    winning_key = models.CharField(max_length=50)
    level = models.IntegerField()
    bonus_key = models.CharField(max_length=50)
    bonus_code = models.CharField(max_length=200)
    bonus_detail = models.CharField(max_length=200,help_text="text show on reward")
    created_date = models.DateTimeField(default=timezone.now)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)

class WheelImageLevel(models.Model):

    ALL_LEVEL = (
        (1, 'LEVEL 1'),
        (2, 'LEVEL 2'),
        # (3, 'LEVEL 3'),
    )   

    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)
    image = models.ImageField(upload_to = 'interstorm', default = 'mediafile/interstorm/no-img.jpg', null=True, blank=True)
    level =  models.IntegerField(choices=ALL_LEVEL,blank=False)
    created_date = models.DateTimeField(default=timezone.now)
    class Meta:
        unique_together = (("level", "vendor",),)


    def image_tag(self):
        return mark_safe('<img src="/mediafile/%s" width="100" height="100" />' % (self.image))

class WheelLevelManage(models.Model):

    ALL_LEVEL = (
        (1, 'LEVEL 1'),
        (2, 'LEVEL 2'),
        # (3, 'LEVEL 3'),
    )   

    vendor = models.ForeignKey(User, on_delete=models.CASCADE,blank=False)
    level = models.IntegerField(choices=ALL_LEVEL,blank=False)
    deposit = models.FloatField("Deposit Less Than",blank=False)
