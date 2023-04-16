from .serializers import ActionCreateSerializer
from .models import Action
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


def get_knowledge_level(translation, user):
    actions = Action.objects.filter(user=user)
    swipe_right = actions.filter(action_type=Action.SWIPE_RIGHT, translation=translation).count()
    swipe_left = actions.filter(action_type=Action.SWIPE_LEFT, translation=translation).count()

    if swipe_right + swipe_left == 0:
        # no actions yet
        return 1
    else:
        # calculate knowledge score based on user actions
        freq = swipe_right / (swipe_left or 1.0)
        freq = int(freq)
        return min(max(freq, 1), 3)
