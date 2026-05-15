<<<<<<< HEAD
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
=======
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
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
        return f"{self.user.username} - {self.day} - {self.exercise.name}"