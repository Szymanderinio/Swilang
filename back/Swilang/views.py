from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action as endpoint
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend


from languages.models import Language
from words.models import Word
from .models import Translation
from .helpers import create_swilang_action
from .serializers import TranslationListSerializer, TranslationDetailSerializer, TranslationCreateSerializer, \
    ReportCreateSerializer
from .filters import BaseTranslationFilter


class TranslationViewSet(ModelViewSet):
    queryset = Translation.objects.all()
    permission_classes = (IsAuthenticated, )
    filter_backends = (DjangoFilterBackend,)
    filterset_class = BaseTranslationFilter

    def get_serializer_context(self):
        context = super(TranslationViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_serializer_class(self):
        if self.action == 'list':
            return TranslationListSerializer
        if self.action == 'create':
            return TranslationCreateSerializer
        return TranslationDetailSerializer

    def create(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer_class()
        data = request.data
        word_text = data.get('word_text', None)
        language_text = data.get('language_text', None)
        translated_word = data.get('translated_word', None)
        if not any([word_text, language_text, translated_word]):
            return Response(data={'error': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            word = Word.objects.get(word=word_text)
            language = Language.objects.get(language_short=language_text)
        except ObjectDoesNotExist:
            return Response(data={'error': 'Word / Language not found'}, status=status.HTTP_404_NOT_FOUND)
        new = Translation.objects.create(word=word, language=language, translated_word=translated_word, created_by=user)
        data = serializer(instance=new).data
        return Response(data=data, status=status.HTTP_201_CREATED)

    @endpoint(detail=True, methods=['POST'])
    def action(self, request, **kwargs):
        obj = self.get_object()
        user = self.request.user
        data = create_swilang_action(request.data, user, obj)
        return Response(data=data, status=status.HTTP_201_CREATED)

    @endpoint(detail=True, methods=['POST'])
    def report(self, request, **kwargs):
        obj = self.get_object()
        user = self.request.user
        create_swilang_action(request.data, user, obj, 2)
        serializer = ReportCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user, translation=obj)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
