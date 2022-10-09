from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Translation
from languages.models import Language
from words.models import Word
from .serializers import TranslationListSerializer, TranslationDetailSerializer, TranslationCreateSerializer, \
    ActionCreateSerializer


class TranslationViewSet(ModelViewSet):
    queryset = Translation.objects.all()
    permission_classes = (IsAuthenticated, )

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
        new = Translation.objects.create(word=word, language=language, translated_word=translated_word)
        data = serializer(instance=new).data
        return Response(data=data, status=status.HTTP_201_CREATED)


    @action(detail=True, methods=['POST'])
    def action(self, request, **kwargs):
        object = self.get_object()
        user = self.request.user
        serializer = ActionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user, translation=object)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


    # def perform_create(self, serializer):
    #     user = self.request.user # TODO created_by
    #     data = serializer
    #     print(data)
    #
    #     validated_data = serializer.validated_data
    #     # word_text = data.get('word_text')
    #     # language_text = data.get('language_text')
    #     try:
    #         print(data)
    #         # print(word_text)
    #         # print(language_text)
    #         # word = Word.objects.get(word=word_text)
    #         # language = Language.objects.get(language=language_text)
    #         # validated_data['word'] = word.id
    #         # validated_data['language'] = language.id
    #
    #     except ObjectDoesNotExist:
    #         return Response(data={'error': 'Word or Language not found'}, status=status.HTTP_404_NOT_FOUND)
    #     print(serializer)
    #     serializer.save()



# @action(detail=False, methods=['GET'])
# def simple_list(self, request, **kwargs):
#     qs = self.queryset
#     serializer = WarehouseSimpleListSerializer(qs, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)