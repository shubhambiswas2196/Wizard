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

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        
        org_name = self.cleaned_data["organization_name"]
        org_slug = slugify(org_name)
        
        # Simple logic: create or get organization
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
