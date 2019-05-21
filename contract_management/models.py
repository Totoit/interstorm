from django.db import models
import datetime

# Create your models here.
#model ที่เกี่ยวกับ ไฟล์สัญญา edit by Tae 11-Dec-2018
class TermAndCondition(models.Model):
	Term_And_Condition_Details =  models.TextField()
	def __str__(self):
		return self.Term_And_Condition_Details


#model ที่เกี่ยวกับการทำสัญญาระหว่าง user กับ เว็ป เก็บเป็นไฟล์ pdf
class UserContract (models.Model):

    class Meta:
        db_table = 'auth_contract' # define your custom name

    ContractID = models.AutoField(primary_key=True)

    FileName = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    FileLocation = models.CharField(max_length=255)

    #เก็บเป็น server time zone ดีกว่า
    timezone = datetime.datetime.now()
    date_modify = models.DateTimeField(default=timezone.now) #or auto_now_add=True

    status = models.CharField(max_length=15, default='active')
    
    def __str__(self):
        return self.FileName