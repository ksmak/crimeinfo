# Generated by Django 5.0.1 on 2024-01-17 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auths', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='activation_code',
            field=models.CharField(blank=True, max_length=32, null=True, verbose_name='код активации'),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='is_active',
            field=models.BooleanField(default=False, verbose_name='активность'),
        ),
    ]
