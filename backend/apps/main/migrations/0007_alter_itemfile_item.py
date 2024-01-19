# Generated by Django 5.0.1 on 2024-01-19 04:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_infofile_options_alter_itemfile_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemfile',
            name='item',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='files', to='main.item', verbose_name='объявление'),
        ),
    ]