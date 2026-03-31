from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager

class Organization(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
