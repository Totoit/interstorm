from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class TreasureChestReward(models.Model):
    class Meta:
        db_table = 'treasure_chest_reward'
    reward_no = models.IntegerField(default=1,help_text = 'example <div><img src="/static/images/board5.png"  height="250px"/></div>')
    name = models.CharField(max_length=20)
    icon = models.ImageField(upload_to = 'mediafile/treasure_chest', default = 'mediafile/treasure_chest/no-img.jpg', null=True, blank=True)
    description = models.CharField(max_length=200)
    level = models.IntegerField(default=1)
    bonus_code = models.TextField(max_length=200,null=True,blank=True)
    NORMAL = '1'
    PLAYAGAIN = '2'
    GOBACK = '3'
    PLAYAGAIN4 = '4'
    TREASURECHEST = '5'
    LUCKKYCARD = '6'
    TOSTART = '7'
    PAUSE = '8'
    LEVELUP = '9'
    RULE_CHIOCE = (
        (NORMAL,'NORMAL'),
        (PLAYAGAIN,'PLAYAGAIN'),
        (GOBACK,'GO BACK'),
        (TREASURECHEST,'TREASURE CHEST'),
        (LUCKKYCARD,'LUCKKY CARDS'),
        (TOSTART,'GO TO BACK START'),
        (LEVELUP,'LEVELUP')
    )
    rule_type = models.CharField(max_length=50, choices=RULE_CHIOCE, default=NORMAL)
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)

# Create your models here0.
class Treasure_Game_Access(models.Model):

    class Meta:
        db_table = 'treasure_game_access'

    user_id = models.CharField(primary_key=True,max_length=255)
    point = models.IntegerField(default=0)
    last_topup = models.DateTimeField()
    position = models.IntegerField(default=0)
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)

class Treasure_Game(models.Model):

    class Meta:
        db_table = 'treasure_game'

    user_id = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    point = models.IntegerField(default=0)
    win_result = models.CharField(max_length=200)
    win_bonus = models.CharField(max_length=200)
    win_bonuscode = models.CharField(max_length=200)
    win_type = models.CharField(max_length=20, default = '')
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)


class Treasure_Game_Log(models.Model):
    class Meta:
        db_table = 'treasure_game_log'

    user_id = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    roll = models.IntegerField(default=0)
    reason = models.CharField(max_length=200)
    type = models.CharField(max_length=50)
    value = models.IntegerField(default=0)
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)


class Treasure_Roll_Bonus_Setting(models.Model):
    class Meta:
        db_table = 'treasure_roll_bonus_setting'
        verbose_name = 'treasure roll bonus'
        verbose_name_plural = 'treasure roll bonus'
    total = models.IntegerField(default=0)
    roll = models.IntegerField(default=0)
    check_first = models.BooleanField(default=False,verbose_name="first deposit")
    start_date = models.DateField()
    active_status = models.CharField(max_length=255, default = '')
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)

class Treasure_Every_Deposit_Setting(models.Model):
    class Meta:
        db_table = 'treasure_every_deposit_setting'
        verbose_name = 'treasure every deposit'
        verbose_name_plural = 'treasure every deposit'
    more_than_total = models.IntegerField(default=0)
    roll = models.IntegerField(default=0)
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)

class Treasure_Transaction(models.Model):
    class Meta:
        db_table = 'treasure_transaction'
    user_id = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=50)
    transaction_date = models.DateTimeField(null=True, blank=True)
    amount = models.IntegerField()
    currency = models.CharField(max_length=50)
    casino_name = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.transaction_id