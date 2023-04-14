from .serializers import ActionCreateSerializer
from django.conf import settings
import deepl

def create_swilang_action(data, user, translation, type=None):
    if type:
        data.update({'action_type': type})
    serializer = ActionCreateSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    if type:
        serializer.save(user=user, translation=translation, action_type=type)
    serializer.save(user=user, translation=translation)

    return serializer.data


def translate(word, target_lang):
    translator = deepl.Translator(settings.DEEPL_AUTH_KEY)

    translated_word = translator.translate_text(
        word,
        source_lang="EN",
        target_lang=str(target_lang.upper()),
        formality='prefer_more',
        tag_handling='html',
    ).text

    return translated_word