from django import forms
from .models import User, Seller, Product

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'mobile', 'email']  # Fields to be updated

        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'mobile': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }

class BecomeSellerForm(forms.Form):
    store_name = forms.CharField(
        required=True,
        max_length=255,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label="Store Name"
    )
    about_your_store = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={'class': 'form-control'}),
        label="About Your Store"
    )
    store_id = forms.CharField(widget=forms.HiddenInput(), required=True)  # Make it required


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['product_name', 'price', 'product_description', 'hashtags', 'image']
        widgets = {
            'product_name': forms.TextInput(attrs={'class': 'form-control', 'id': 'product_name'}),
            'price': forms.NumberInput(attrs={'class': 'form-control', 'id': 'price'}),
            'product_description': forms.Textarea(attrs={'class': 'form-control', 'id': 'product_description'}),
            'hashtags': forms.TextInput(attrs={'class': 'form-control', 'id': 'hashtags', 'placeholder': 'Enter hashtags for your product'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control', 'id': 'image'}),
        }