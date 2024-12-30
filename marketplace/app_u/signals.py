import random
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User

def generate_unique_uid():
    prefix = "ANK"  # Example prefix
    while True:
        random_number = random.randint(10**8, 10**9 - 1)  # Generate a 9-digit number
        uid = f"{prefix}{random_number}"
        if not User.objects.filter(uid=uid).exists():
            return uid

@receiver(post_save, sender=User)
def create_uid(sender, instance, created, **kwargs):
    if created and not instance.uid:
        instance.uid = generate_unique_uid()
        instance.save()
