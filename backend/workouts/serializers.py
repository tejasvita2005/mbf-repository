
from rest_framework import serializers
from .models import WorkoutPlan


class WorkoutSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkoutPlan
        fields = '__all__'
        read_only_fields = ['user']
from .models import WorkoutPlan, PostureResult

class PostureResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostureResult
        fields = "__all__"
        read_only_fields = ["user"]