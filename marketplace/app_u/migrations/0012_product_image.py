# Generated by Django 5.1.4 on 2024-12-28 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_u', '0011_alter_user_uid'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='products/'),
        ),
    ]