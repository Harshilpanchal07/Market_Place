from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_email(subject, template_name, context, recipient_list):
    # Render the HTML content
    html_message = render_to_string(template_name, context)
    # Strip the HTML tags for the plain text version
    plain_message = strip_tags(html_message)

    send_mail(
        subject,
        plain_message,
        settings.EMAIL_HOST_USER,  # From email
        recipient_list,
        html_message=html_message,
    )
