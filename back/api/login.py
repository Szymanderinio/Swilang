"""
All rest_auth login views, except login view ignoers username case.
"""

from django.urls import re_path
from dj_rest_auth.views import (
    LoginView, LogoutView, UserDetailsView, PasswordChangeView,
    PasswordResetView, PasswordResetConfirmView
)


class IgnoreCaseLoginView(LoginView):
    """
    Ignores case in username.
    """

    def post(self, request, *args, **kwargs):
        email = self.request.data.get('email')
        if isinstance(email, str):
            self.request.data['email'] = email.lower()
        return super().post(request, *args, **kwargs)


urlpatterns = [
    # URLs that do not require a session or valid token
    re_path(r'^password/reset/$', PasswordResetView.as_view(),
        name='rest_password_reset'),
    re_path(r'^password/reset/confirm/$', PasswordResetConfirmView.as_view(),
        name='rest_password_reset_confirm'),
    re_path(r'^login/$', IgnoreCaseLoginView.as_view(), name='rest_login'),
    # URLs that require a user to be logged in with a valid session / token.
    re_path(r'^logout/$', LogoutView.as_view(), name='rest_logout'),
    re_path(r'^user/$', UserDetailsView.as_view(), name='rest_user_details'),
    re_path(r'^password/change/$', PasswordChangeView.as_view(),
        name='rest_password_change'),
]