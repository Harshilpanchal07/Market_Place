from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
import uuid

# Custom user manager
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)

    def get_by_natural_key(self, username):
        """
        Get user by their natural key (username).
        """
        return self.get(username=username)

# User model
class User(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True, primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Password will be hashed
    profile_picture = models.ImageField(upload_to='profile_picture/', null=True, blank=True)  # Added profile picture field

    # Unique user ID
    uid = models.CharField(max_length=12, unique=True, editable=False) # 12-digit unique ID

    # Profile information
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    mobile = models.CharField(max_length=15, blank=True)

    # Roles
    is_seller = models.BooleanField(default=False)  # Only for sellers
    is_staff = models.BooleanField(default=False)   # Required for admin site
    is_superuser = models.BooleanField(default=False)  # Full permissions, also acts as admin

     # Active status
    is_active = models.BooleanField(default=False)  # Default to False until email verification


    USERNAME_FIELD = 'username'  # Use username as the unique identifier
    REQUIRED_FIELDS = ['email']  # Email is required

    objects = CustomUserManager()

    def __str__(self):
        return self.username
    
    # Permissions-related methods
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
    

# Seller model
class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller')
    store_name = models.CharField(max_length=255, unique=True)
    store_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    store_bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.store_name

# Product model
class Product(models.Model):
    product_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    product_name = models.CharField(max_length=255)
    store_name = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # Added image field
    product_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    hashtags = models.CharField(max_length=255, blank=False,default='3D assets',help_text="Enter hashtags for better searchability.")

    def __str__(self):
        return self.product_name
