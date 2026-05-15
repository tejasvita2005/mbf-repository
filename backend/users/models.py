from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    height = models.FloatField()
    weight = models.FloatField()
    injury_type = models.CharField(max_length=100)
    fitness_level = models.CharField(max_length=50)
    equipment_available = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username