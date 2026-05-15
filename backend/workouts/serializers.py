<<<<<<< HEAD
from rest_framework import serializers
from .models import WorkoutPlan


class WorkoutSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkoutPlan
        fields = '__all__'
=======
from rest_framework import serializers
from .models import WorkoutPlan


class WorkoutSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkoutPlan
        fields = '__all__'
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
        read_only_fields = ['user']