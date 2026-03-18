import json

from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import User, Organization
from .forms import LoginForm, SignupForm


def _user_payload(user, request):
    organization = getattr(user, "organization", None)
    request_organization = getattr(request, "organization", None)
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "organization": (
            {
                "id": organization.id,
                "name": organization.name,
                "slug": organization.slug,
            }
            if organization
            else None
        ),
        "request_organization": (
            {
                "id": request_organization.id,
                "name": request_organization.name,
                "slug": request_organization.slug,
            }
            if request_organization
            else None
        ),
    }


def _parse_json_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return None


@csrf_exempt
@require_http_methods(["POST"])
def signup_view(request):
    payload = _parse_json_body(request)
    if payload is None:
        return JsonResponse({"detail": "Invalid JSON body."}, status=400)

    form = SignupForm(payload)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=400)

    user = form.save()
    login(request, user)
    return JsonResponse(
        {
            "message": "Signup successful.",
            "user": _user_payload(user, request),
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    payload = _parse_json_body(request)
    if payload is None:
        return JsonResponse({"detail": "Invalid JSON body."}, status=400)

    form = LoginForm(request=request, data=payload)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=400)

    user = form.get_user()
    login(request, user)
    return JsonResponse(
        {
            "message": "Login successful.",
            "user": _user_payload(user, request),
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logout successful."})


@require_GET
def dashboard_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False, "user": None}, status=401)

    return JsonResponse(
        {
            "authenticated": True,
            "user": _user_payload(request.user, request),
        }
    )


from django.core.cache import cache

@require_GET
def check_email_view(request):
    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "Email parameter is required."}, status=400)

    # Basic Rate Limiting: 10 requests per minute per IP
    ip = request.META.get("REMOTE_ADDR")
    cache_key = f"ratelimit_email_check_{ip}"
    requests_count = cache.get(cache_key, 0)
    
    if requests_count >= 10:
        return JsonResponse({"error": "Too many requests. Please try again later."}, status=429)
    
    cache.set(cache_key, requests_count + 1, 60) # 60 seconds expiry

    exists = User.objects.filter(email=email).exists()
    return JsonResponse({"exists": exists})
