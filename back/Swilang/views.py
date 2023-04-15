
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action as endpoint
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Translation, Report
from .helpers import create_swilang_action, translate
from .serializers import TranslationListSerializer, TranslationDetailSerializer, TranslationCreateSerializer, \
    ReportCreateSerializer, ReportSerializer
from .filters import BaseTranslationFilter


class TranslationViewSet(ModelViewSet):
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

    def get_queryset(self):
        if self.action == 'list':
            return Translation.objects.filter(is_confirmed=True)
        if self.action == 'not_confirmed':
            return Translation.objects.filter(is_confirmed=False)
        return Translation.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        word = serializer.validated_data.get('word').word
        language = serializer.validated_data.get('language').language_short
        auto_translated = serializer.validated_data.get('auto_translated', None)
        translated_word = serializer.validated_data.get('translated_word', None)
        if auto_translated:
            instance = serializer.save(created_by=user, translated_word=translate(word, language))
        else:
            instance = serializer.save(created_by=user, translated_word=translated_word)
        return instance

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

    @endpoint(detail=False, methods=['GET'])
    def not_confirmed(self, request, **kwargs):
        serializer = self.get_serializer_class()
        qs = self.get_queryset()
        serializer = serializer(data=qs, many=True)
        serializer.is_valid()
        data = serializer.data
        return Response(data=data, status=status.HTTP_201_CREATED)

class ReportViewSet(ModelViewSet):
    queryset = Report.objects.filter(is_solved=False)
    permission_classes = (IsAuthenticated, )
    filter_backends = (DjangoFilterBackend,)
    serializer_class = ReportSerializer

