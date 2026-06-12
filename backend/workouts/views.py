from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import WorkoutPlan
from .serializers import WorkoutSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workout_list_create(request):

    if request.method == 'GET':
        workouts = WorkoutPlan.objects.all()
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WorkoutSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def workout_detail(request, pk):

    try:
        workout = WorkoutPlan.objects.get(id=pk)

    except WorkoutPlan.DoesNotExist:
        return Response(
            {"error": "Workout not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = WorkoutSerializer(workout)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = WorkoutSerializer(workout, data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        workout.delete()

        return Response(
            {"message": "Workout deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )