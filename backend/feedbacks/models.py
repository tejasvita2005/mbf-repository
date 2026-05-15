from django.db import models
from django.contrib.auth.models import User
from workouts.models import WorkoutPlan

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)

    pain_level = models.IntegerField()
    recovery_progress = models.IntegerField()

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username