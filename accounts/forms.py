from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, Organization
from django.utils.text import slugify

class SignupForm(forms.ModelForm):
    organization_name = forms.CharField(max_length=255, label="Organization Name")
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password')

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if email:
            domain = email.split("@")[-1].lower()
            public_domains = [
                "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
                "live.com", "icloud.com", "me.com", "msn.com", "aol.com"
            ]
            if domain in public_domains:
                raise forms.ValidationError("Please use your professional workspace email address.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        
        org_name = self.cleaned_data["organization_name"]
        org_slug = slugify(org_name)
        
        # SECURITY FIX: Prevent slug collisions. Check if organization already exists.
        if Organization.objects.filter(slug=org_slug).exists():
             raise forms.ValidationError({
                 "organization_name": "An organization with a similar name already exists. Please choose a more unique name."
             })

        organization, created = Organization.objects.get_or_create(
            slug=org_slug, 
            defaults={'name': org_name}
        )
        user.organization = organization
        
        if commit:
            user.save()
        return user

class LoginForm(AuthenticationForm):
    username = forms.EmailField(label="Email")
