<<<<<<< HEAD
from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
=======
from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
        fields = '__all__'