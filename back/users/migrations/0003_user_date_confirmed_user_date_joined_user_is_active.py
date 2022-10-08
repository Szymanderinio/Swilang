# Generated by Django 4.1.2 on 2022-10-08 19:20

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_first_name_user_is_staff_user_last_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='date_confirmed',
            field=models.DateTimeField(blank=True, null=True, verbose_name='date confirmed'),
        ),
        migrations.AddField(
            model_name='user',
            name='date_joined',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined'),
        ),
        migrations.AddField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=False, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active'),
        ),
    ]