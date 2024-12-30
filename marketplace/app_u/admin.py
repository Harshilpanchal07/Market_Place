from django.contrib import admin
from .models import User, Seller, Product

# Register your models here.
# Custom User Admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_seller', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    list_filter = ('is_seller', 'is_staff', 'is_superuser')
    ordering = ('username',)

# Seller Admin
@admin.register(Seller)
class SellerAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'user', 'created_at')
    search_fields = ('store_name', 'user__username')
    ordering = ('store_name',)

# Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'store_name', 'price', 'created_at')
    search_fields = ('product_name', 'store_name__store_name')
    list_filter = ('store_name',)
    ordering = ('product_name',)

