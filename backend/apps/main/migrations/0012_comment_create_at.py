# Generated by Django 4.2.5 on 2024-01-26 17:03

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_alter_category_photo_alter_infofile_file_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='create_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='создан'),
            preserve_default=False,
        ),
    ]