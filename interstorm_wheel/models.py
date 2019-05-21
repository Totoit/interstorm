from django.db import models

# Create your models here.
class test_db (models.Model):
    class Meta:
        db_table = "test_db"

    name = models.CharField(max_length=255, default='-')
    detail = models.TextField(max_length=255, default = '-')

    def __str__(self):
        return self.name