from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext as _
from django.utils import timezone

from users.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(
        _('First name'), max_length=32, blank=True, null=True
    )
    last_name = models.CharField(
        _('last name'), max_length=128, blank=True, null=True
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether user can log into admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=False,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    date_of_birth = models.DateField(null=True, blank=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    date_confirmed = models.DateTimeField(_('date confirmed'), null=True, blank=True)
    current_language = models.ForeignKey('languages.Language', null=True, blank=True, on_delete=models.SET_NULL)

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')