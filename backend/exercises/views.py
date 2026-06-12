from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Exercise
from .serializers import ExerciseSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def exercise_list_create(request):

    if request.method == 'GET':

        exercises = Exercise.objects.all()

        serializer = ExerciseSerializer(exercises, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':

        serializer = ExerciseSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def exercise_detail(request, pk):

    try:
        exercise = Exercise.objects.get(id=pk)

    except Exercise.DoesNotExist:

        return Response(
            {'error': 'Exercise not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':

        serializer = ExerciseSerializer(exercise)

        return Response(serializer.data)

    elif request.method == 'PUT':

        serializer = ExerciseSerializer(
            exercise,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == 'DELETE':

        exercise.delete()

        return Response(
            {'message': 'Exercise deleted successfully'},
            status=status.HTTP_200_OK
        )