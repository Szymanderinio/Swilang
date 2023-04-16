from rest_framework import serializers

from languages.models import Language
from words.models import Word
from .models import Translation, Action, Report


class TranslationListSerializer(serializers.ModelSerializer):
    word_text = serializers.CharField(source='word.word')
    language_text = serializers.CharField(source='language.language_short')
    knowledge_level = serializers.SerializerMethodField()

    def get_knowledge_level(self, obj):
        from .helpers import get_knowledge_level
        user = self.context['request'].user
        return get_knowledge_level(obj, user)

    class Meta:
        model = Translation
        fields = ('id', 'word_text', 'translated_word', 'language_text', 'knowledge_level')


class TranslationDetailSerializer(serializers.ModelSerializer):
    word_text = serializers.CharField(source='word.word')
    language_short_text = serializers.CharField(source='language.language_short')
    language_text = serializers.CharField(source='language.language')
    created_by = serializers.StringRelatedField(source='created_by.email')

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
            'auto_translated',
            'created_by',
            'created_at'
        )


class TranslationCreateSerializer(serializers.ModelSerializer):
    word = serializers.CharField()
    language = serializers.CharField()

    class Meta:
        model = Translation
        fields = (
            'id',
            'word',
            'translated_word',
            'language',
            'is_confirmed',
            'auto_translated',
            'created_by',
            'created_at'
        )

    def validate(self, data):
        word_text = data['word']
        language_text = data['language']
        qs = Translation.objects.filter(word__word__icontains=word_text, language__language__icontains=language_text)
        if qs.exists():
            raise serializers.ValidationError("Translation already exists in this language with current word!")
        if 'translated_word' not in data and 'auto_translated' not in data:
            raise serializers.ValidationError("Add translation or use auto translate feature!")
        word, created = Word.objects.get_or_create(word=word_text, is_confirmed=True)
        language = Language.objects.get(language=language_text)
        data['word'] = word
        data['language'] = language
        return data


class ActionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Action
        fields = ('action_type',)


class ReportCreateSerializer(serializers.ModelSerializer):

    def validate(self, data):
        report_type = data.get('report_type', None)
        if report_type == 2 and not data.get('comment', None):
            raise serializers.ValidationError("You must add a comment!")
        return data

    class Meta:
        model = Report
        fields = ('report_type', 'comment')


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
