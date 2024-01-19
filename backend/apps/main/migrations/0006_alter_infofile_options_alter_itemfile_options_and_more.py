# Generated by Django 4.2.3 on 2024-01-18 07:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_remove_info_media_remove_item_media_itemfile_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='infofile',
            options={'verbose_name': 'файл новости', 'verbose_name_plural': 'файлы новостей'},
        ),
        migrations.AlterModelOptions(
            name='itemfile',
            options={'verbose_name': 'файл объявления', 'verbose_name_plural': 'файлы объявлений'},
        ),
        migrations.RemoveField(
            model_name='category',
            name='data',
        ),
        migrations.AddField(
            model_name='category',
            name='fields',
            field=models.JSONField(blank=True, null=True, verbose_name='поля'),
        ),
        migrations.AlterField(
            model_name='infofile',
            name='info',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='files', to='main.info', verbose_name='новость'),
        ),
    ]