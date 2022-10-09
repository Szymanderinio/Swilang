from rest_framework import serializers

from languages.models import Language
from words.models import Word
from .models import Translation, Action


class TranslationListSerializer(serializers.ModelSerializer):
    word_text = serializers.CharField(source='word.word')
    language_text = serializers.CharField(source='language.language_short')

    class Meta:
        model = Translation
        fields = ('id', 'word_text', 'translated_word', 'language_text')


class TranslationDetailSerializer(serializers.ModelSerializer):
    word_text = serializers.CharField(source='word.word')
    language_short_text = serializers.CharField(source='language.language_short')
    language_text = serializers.CharField(source='language.language')

    class Meta:
        model = Translation
        fields = (
            'id',
            'word',
            'word_text',
            'translated_word',
            'language_text',
            'language_short_text',
            'language',
            'is_confirmed',
            'created_at'
        )


class TranslationCreateSerializer(serializers.ModelSerializer):
    word_text = serializers.CharField(source='word.word')
    language_text = serializers.CharField(source='language.language_short')

    class Meta:
        model = Translation
        fields = (
            'id',
            'word',
            'word_text',
            'translated_word',
            'language',
            'language_text',
            'is_confirmed',
            'created_at'
        )


class ActionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Action
        fields = ('action_type',)
