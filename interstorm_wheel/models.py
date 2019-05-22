from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class test_db (models.Model):
    class Meta:
        db_table = "test_db"

    name = models.CharField(max_length=255, default='-')
    detail = models.TextField(max_length=255, default = '-')
    create_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=False,
    )

    def __str__(self):
        return self.name