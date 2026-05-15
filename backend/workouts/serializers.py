from rest_framework import serializers
from .models import WorkoutPlan


class WorkoutSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkoutPlan
        fields = '__all__'
        read_only_fields = ['user']