from rest_framework import serializers

from .models import Word


class WordSerializer(serializers.ModelSerializer):
    added_by = serializers.StringRelatedField(source='added_by.email')

    class Meta:
        model = Word
        fields = ('id', 'word', 'is_confirmed', 'created_at', 'added_by')
