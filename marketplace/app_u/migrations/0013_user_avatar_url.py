# Generated by Django 5.1.4 on 2024-12-29 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_u', '0012_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]