from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Feedback
from .serializers import FeedbackSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def feedback_list_create(request):

    if request.method == 'GET':
        feedbacks = Feedback.objects.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def feedback_detail(request, pk):

    try:
        feedback = Feedback.objects.get(id=pk)

    except Feedback.DoesNotExist:
        return Response(
            {'error': 'Feedback not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = FeedbackSerializer(feedback, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        feedback.delete()

        return Response(
            {'message': 'Feedback deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )