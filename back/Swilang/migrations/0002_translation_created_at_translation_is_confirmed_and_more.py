# Generated by Django 4.1.2 on 2022-10-09 06:40

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('languages', '0001_initial'),
        ('words', '0002_word_is_confirmed'),
        ('Swilang', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='translation',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='translation',
            name='is_confirmed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='translation',
            name='language',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='languages.language'),
        ),
        migrations.AddField(
            model_name='translation',
            name='translated_word',
            field=models.CharField(max_length=50, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='translation',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='words.word'),
        ),
    ]