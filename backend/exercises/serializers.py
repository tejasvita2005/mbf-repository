<<<<<<< HEAD
from rest_framework import serializers
from .models import Exercise


class ExerciseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exercise
=======
from rest_framework import serializers
from .models import Exercise


class ExerciseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exercise
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
        fields = '__all__'