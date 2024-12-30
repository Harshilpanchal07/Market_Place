# Generated by Django 5.1.4 on 2024-12-12 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_u', '0003_user_is_admin_user_is_seller_seller_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='hashtags',
            field=models.CharField(default='3D assets', help_text='Enter hashtags for better searchability.', max_length=255),
        ),
    ]