from django.contrib.auth import get_user_model

from dj_rest_auth.views import UserDetailsView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from users.serializers import UserSerializer, CreateUserSerializer


class CreateUserView(CreateAPIView):
    models = get_user_model()
    permission_classes = (AllowAny,)
    serializer_class = CreateUserSerializer


class UserApiView(UserDetailsView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        return self.request.user

