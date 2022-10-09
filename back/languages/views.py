from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class LanguageViewSet(viewsets.ModelViewSet):
    pass
# @action(detail=False, methods=['GET'])
# def simple_list(self, request, **kwargs):
#     qs = self.queryset
#     serializer = WarehouseSimpleListSerializer(qs, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)