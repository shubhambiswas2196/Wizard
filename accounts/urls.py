from django.urls import path
from . import views

urlpatterns = [
    path("api/auth/signup/", views.signup_view, name="signup"),
    path("api/auth/login/", views.login_view, name="login"),
    path("api/auth/logout/", views.logout_view, name="logout"),
    path("api/auth/me/", views.dashboard_view, name="dashboard"),
    path("api/auth/check-email/", views.check_email_view, name="check-email"),
]
