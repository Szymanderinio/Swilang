from .serializers import ActionCreateSerializer


def create_swilang_action(data, user, translation, type=None):
    if type:
        data.update({'action_type': type})
    serializer = ActionCreateSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    if type:
        serializer.save(user=user, translation=translation, action_type=type)
    serializer.save(user=user, translation=translation)

    return serializer.data