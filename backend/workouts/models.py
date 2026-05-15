from django.db import models
from django.contrib.auth.models import User
from exercises.models import Exercise

class WorkoutPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.CharField(max_length=20)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    reps = models.IntegerField()
    sets = models.IntegerField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.day} - {self.exercise.name}"