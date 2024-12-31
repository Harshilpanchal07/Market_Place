import random
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import User

def generate_unique_uid():
    prefix = "ANK"  # Example prefix
    while True:
        random_number = random.randint(10**8, 10**9 - 1)  # Generate a 9-digit number
        uid = f"{prefix}{random_number}"
        if not User.objects.filter(uid=uid).exists():
            return uid

@receiver(pre_save, sender=User)
def assign_uid(sender, instance, **kwargs):
    # Generate UID if not already set
    if not instance.uid:
        instance.uid = generate_unique_uid()
