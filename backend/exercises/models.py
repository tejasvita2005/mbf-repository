from django.db import models

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    injury_type = models.CharField(max_length=100)
    fitness_level = models.CharField(max_length=50)
    equipment = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    body_part = models.CharField(max_length=100)
    reps = models.IntegerField()
    sets = models.IntegerField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name