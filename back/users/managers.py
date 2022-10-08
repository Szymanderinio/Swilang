from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        if not email:
            raise ValueError('The email must be set')
        email = email.lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        """
        Overrides email field to lowercase when user is created
        """

        return self._create_user(email, password, **extra_fields)

    def get_or_create(self, **kwargs):
        email = kwargs.get('email')
        if email is None:
            raise ValueError('email is required')
        try:
            user = self.model.objects.get(email=email)
        except self.model.DoesNotExist:
            user = self.model(**kwargs)
            user.save()

        return user


    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, **extra_fields)