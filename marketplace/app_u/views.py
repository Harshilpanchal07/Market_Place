from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .models import User, Seller, Product
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.decorators import login_required
from .forms import UserProfileForm, BecomeSellerForm, ProductForm# We will create this form below
from django.http import JsonResponse
from uuid import uuid4
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
import time
from datetime import datetime, timedelta
from django.contrib.auth.tokens import default_token_generator
from .utility import send_email  # Import the utility function
from django.contrib.auth import get_user_model
from django.core.files import File
import os

# Create your views here.
def home(request):
    # Query all products from the database
    products = Product.objects.all()
    
    # Pass products to the template
    return render(request, 'home.html', {'products': products})

# Login view
def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Store session automatically
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')

    return render(request, 'login.html')

# Utility function to generate OTP
def generate_otp():
    return get_random_string(length=6, allowed_chars='0123456789')

# Utility function to send email
def send_email(subject, template, context, recipient_list):
    message = f"Your OTP is: {context['otp_code']}"
    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)

# OTP Verification View
def verify_otp(request):
    temp_user = request.session.get('temp_user')
    if not temp_user:
        messages.error(request, 'Session expired or invalid data. Please try again.')
        return redirect('signup')

    otp_created_at = temp_user.get('otp_created_at')
    time_elapsed = time.time() - otp_created_at
    remaining_seconds = max(0, int(300 - time_elapsed))

    if remaining_seconds <= 0:
        messages.error(request, 'Your OTP has expired. Please request a new one.')
        del request.session['temp_user']
        return redirect('signup')

    if request.method == 'POST':
        otp = request.POST.get('otp', '')
        stored_otp = temp_user.get('otp')

        if otp == stored_otp:
            hashed_password = make_password(temp_user['password'])
            user = User(
                username=temp_user['username'],
                email=temp_user['email'],
                password=hashed_password,
                is_active=True,
                profile_picture=temp_user.get('profile_picture')  # Save only the file path
            )
            user.save()
            del request.session['temp_user']
            messages.success(request, 'Email verified successfully! You can now log in.')
            return redirect('login')

        else:
            messages.error(request, 'Invalid OTP. Please try again.')

    minutes, seconds = divmod(remaining_seconds, 60)
    return render(request, 'otp.html', {'email': temp_user['email'], 'remaining_minutes': minutes, 'remaining_seconds': seconds})


# Signup View
def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        email = request.POST['email']
        selected_avatar = request.POST.get('selected_avatar')  # Avatar path

        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return redirect('signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
            return redirect('signup')

        # Generate OTP and store temporary user data in session
        otp = generate_otp()
        request.session['temp_user'] = {
            'username': username,
            'email': email,
            'password': password,
            'otp': otp,
            'otp_created_at': time.time(),
            'profile_picture': selected_avatar,  # Save only the avatar's path
        }
        # Send OTP to user's email
        send_email('Verify your email address', 'otp_email.html', {'otp_code': otp}, [email])
        messages.success(request, 'Please check your email for the OTP.')
        return redirect('verify_otp')

    avatars_path = os.path.join(settings.MEDIA_ROOT, 'avatars')
    avatars = [f'avatars/{f}' for f in os.listdir(avatars_path) if os.path.isfile(os.path.join(avatars_path, f))]
    return render(request, 'signup.html', {'avatars': avatars})


# Logout view
def logout_view(request):
    logout(request)
    return redirect('home')

#profile_view
@login_required
def profile(request, uid=None):
    # Fetch the user based on UID or use the logged-in user
    user = get_object_or_404(User, uid=uid) if uid else request.user

    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully.")
            return redirect('profile', uid=user.uid)
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = UserProfileForm(instance=user)

    return render(request, 'profile.html', {'form': form, 'user': user})


@login_required
def change_password(request):
    if request.method == 'POST':
        old_password = request.POST.get('old_password')

        # Check if the old password is correct
        user = authenticate(username=request.user.username, password=old_password)
        if not user:
            messages.error(request, "Old password is incorrect.")
            return redirect('change_password')
        
        # Generate token
        token = default_token_generator.make_token(user)
        reset_link = request.build_absolute_uri(f"/reset-password/{user.uid}/{token}/")

        # Redirect to reset password for further steps
        return redirect(reset_link)

    return render(request, 'check_pass.html')

# Forgot Password view
def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            reset_link = request.build_absolute_uri(f"/reset-password/{user.uid}/{token}/")

            # Send password reset email
            send_mail(
                'Password Reset',
                f'Click the following link to reset your password: {reset_link}',
                'no-reply@example.com',
                [email],
            )

            messages.success(request, "Password reset link sent to your email.")
            return redirect('login')

        except User.DoesNotExist:
            messages.error(request, "No user found with this email address.")
            return redirect('forgot_password')

    return render(request, 'forgot_pass.html')

# Reset Password view
def reset_password(request, uid, token):
    try:
        # Retrieve the user directly by user ID
        user = get_user_model().objects.get(uid=uid)

        # Check if the token is valid
        if default_token_generator.check_token(user, token):
            if request.method == 'POST':
                new_password = request.POST.get('new_password')
                confirm_password = request.POST.get('confirm_password')

                if new_password != confirm_password:
                    messages.error(request, "Passwords do not match.")
                    return redirect(f'/reset-password/{uid}/{token}/')

                # Update user password
                user.set_password(new_password)
                user.save()
                messages.success(request, "Your password has been reset successfully. Pleae log in agian.")
                return redirect('login')

            return render(request, 'reset_pass.html', {'uid': uid, 'token': token})

        else:
            messages.error(request, "The reset link is invalid or expired.")
            return redirect('change_password')  # Redirect back to change_password on invalid link

    except get_user_model().DoesNotExist:
        messages.error(request, "The reset link is invalid or expired.")
        return redirect('change_password')  # Redirect to change password in case of invalid user


@login_required
def profile_access(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Please log in to view your profile.'}, status=403)
    return JsonResponse({'success': True})

@login_required
def become_seller(request):
    # Check if UUID is already in the session
    if 'uuid_value' not in request.session:
        request.session['uuid_value'] = str(uuid4())  # Generate and store UUID in session

    uuid_value = request.session['uuid_value']  # Retrieve UUID from session

    if request.method == 'POST':
        print(f"POST Data: {request.POST}")  # Debug POST data
        form = BecomeSellerForm(request.POST)

        if form.is_valid():
            store_name = form.cleaned_data['store_name']

            # Check for unique store name
            if Seller.objects.filter(store_name=store_name).exists():
                messages.error(request, "Store name already exists. Please choose a different name.")
                return redirect('seller_form')

            # Create seller profile
            user = request.user
            user.is_seller = True
            user.save()

            Seller.objects.create(
                user=user,
                store_name=store_name,
                store_bio=form.cleaned_data.get('about_your_store'),
            )
            messages.success(request, "You are now registered as a seller.")
            return redirect('profile')
        else:
            print(f"Form Errors: {form.errors}")
            messages.error(request, "Please correct the errors in the form.")
    else:
        form = BecomeSellerForm(initial={'store_id': uuid_value})

    return render(request, 'seller_form.html', {'form': form, 'uuid': uuid_value})


@login_required
def seller_dashboard(request):
    if not request.user.is_seller:
        messages.error(request, "Access denied. You are not a seller.")
        return redirect('home')
            
    seller = Seller.objects.get(user=request.user)
    context = {
        'user': request.user,  # Pass the user object
        'seller': seller,  # Pass the seller object (which contains store_name, store_bio, etc.)
    }
    return render(request, 'seller_dashboard.html', context)

@login_required
def add_product(request):
    if not hasattr(request.user, 'seller'):  # Ensure the user is a seller
        messages.error(request, "Only sellers can add products.")
        return redirect('home')

    if request.method == 'POST':
        print("POST Data:", request.POST)
        print("FILES Data:", request.FILES)
        form = ProductForm(request.POST, request.FILES)  # Include request.FILES for file uploads
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':  # Check for AJAX request
            if form.is_valid():
                product = form.save(commit=False)
                product.store_name = Seller.objects.get(user=request.user)  # Link product to the seller's store
                product.save()
                return JsonResponse({
                    'message': 'Product added successfully!',
                    'redirect_url': reverse('seller_dashboard')
                }, status=200)
            else:
                return JsonResponse({'errors': form.errors}, status=400)
        else:
            if form.is_valid():
                product = form.save(commit=False)
                product.store_name = Seller.objects.get(user=request.user)
                product.save()
                messages.success(request, "Product added successfully!")
                return redirect('seller_dashboard')
    else:
        form = ProductForm()

    return render(request, 'add_product.html', {'form': form})

@login_required
def edit_product(request, product_id):
    try:
        product = Product.objects.get(product_id=product_id, store_name__user=request.user)
    except Product.DoesNotExist:
        messages.error(request, "You do not have permission to edit this product.")
        return redirect('seller_dashboard')

    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, "Product updated successfully!")
            return redirect('seller_dashboard')
    else:
        form = ProductForm(instance=product)

    return render(request, 'edit_product.html', {'form': form, 'product': product})

@login_required
def delete_product(request, product_id):
    try:
        product = Product.objects.get(product_id=product_id, store_name__user=request.user)
        product.delete()
        messages.success(request, "Product deleted successfully!")
    except Product.DoesNotExist:
        messages.error(request, "You do not have permission to delete this product.")

    return redirect('seller_dashboard')




