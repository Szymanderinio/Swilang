from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

from rest_framework import exceptions, serializers
from rest_framework.authentication import authenticate

from users.models import User

from words.models import Word
from Swilang.models import Translation, Action
from languages.models import Language


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(allow_blank=True)
    password = serializers.CharField(allow_blank=True, style={
        'input_type': 'password'})

    def _validate_email(self, email, password):
        user = None

        if email and password:
            user = authenticate(email=email, password=password)
        else:
            msg = _('Unable to log in with provided credentials.')
            raise exceptions.ValidationError(msg)

        return user

    @staticmethod
    def _validate_username_email(username, email, password):
        user = None

        if email and password:
            user = authenticate(email=email, password=password)
        elif username and password:
            user = authenticate(username=username, password=password)
        else:
            msg = _('Unable to log in with provided credentials.')
            raise exceptions.ValidationError(msg)

        return user

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = self._validate_email(email, password)

        # Did we get back an active user?
        if user:
            if not user.is_active:
                msg = _('User account is disabled.')
                raise exceptions.ValidationError(msg)
        else:
            msg = _('Unable to log in with provided credentials.')
            raise exceptions.ValidationError(msg)
        attrs['user'] = user
        return attrs

    class Meta:
        model = User
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    words_added = serializers.SerializerMethodField()
    translations_added = serializers.SerializerMethodField()
    swipes_left = serializers.SerializerMethodField()
    swipes_right = serializers.SerializerMethodField()
    reports = serializers.SerializerMethodField()
    translations_knowledge = serializers.SerializerMethodField()

    def get_words_added(self, obj):
        return Word.objects.filter(added_by=obj, is_confirmed=True).count()

    def get_translations_added(self, obj):
        return Translation.objects.filter(created_by=obj, is_confirmed=True).count()

    def get_swipes_left(self, obj):
        return Action.objects.filter(user=obj, action_type=Action.SWIPE_LEFT).count()

    def get_swipes_right(self, obj):
        return Action.objects.filter(user=obj, action_type=Action.SWIPE_RIGHT).count()

    def get_reports(self, obj):
        return Action.objects.filter(user=obj, action_type=Action.REPORT).count()

    def get_translations_knowledge(self, obj):
        from Swilang.helpers import get_knowledge_level
        user = self.context['request'].user
        qs = Translation.objects.filter(language=obj.current_language)
        dict = {
            1: 0,
            2: 0,
            3: 0,
        }
        for q in qs:
            level = get_knowledge_level(q, user)
            dict[level] += 1
        return dict

    class Meta:
        model = User
        fields = ('pk', 'email', 'is_staff', 'first_name', 'last_name', 'date_of_birth', 'date_joined',
                  'current_language', 'words_added', 'translations_added', 'swipes_left', 'swipes_right', 'reports',
                  'translations_knowledge')


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            current_language=validated_data['current_language'],
            is_active=True,
        )
        return user

    class Meta:
        model = User
        fields = ('pk', 'email', 'password', 'current_language')
