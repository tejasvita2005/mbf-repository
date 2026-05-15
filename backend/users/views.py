<<<<<<< HEAD
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer


@api_view(['POST'])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {'message': 'User registered successfully'},
            status=status.HTTP_201_CREATED
        )

=======
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer


@api_view(['POST'])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {'message': 'User registered successfully'},
            status=status.HTTP_201_CREATED
        )

>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)