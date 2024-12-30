from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_user, name='login'),
    path('signup/', views.signup, name='signup'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/<str:uid>/', views.profile, name='profile'),
    path('profile/', views.profile, name='profile'),# Default profile for logged-in user
    path('seller_form/', views.become_seller, name='seller_form'),
    path('seller-dashboard/', views.seller_dashboard, name='seller_dashboard'),
    path('add-product/', views.add_product, name='add_product'),
    path('edit-product/<uuid:product_id>/', views.edit_product, name='edit_product'),
    path('delete-product/<uuid:product_id>/', views.delete_product, name='delete_product'),
    path('change-password/', views.change_password, name='change_password'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/<uid>/<token>/', views.reset_password, name='reset_password'),
]