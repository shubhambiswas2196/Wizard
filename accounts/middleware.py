from django.http import HttpResponseForbidden
from .models import Organization

class SubdomainMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':')[0]
        host_parts = host.split('.')
        
        has_subdomain = (len(host_parts) >= 2 and host_parts[-1] == 'localhost') or (len(host_parts) >= 3)
        
        if has_subdomain:
            subdomain = host_parts[0]
            try:
                organization = Organization.objects.get(slug=subdomain)
                request.organization = organization
                
                if request.user.is_authenticated:
                    user_org = getattr(request.user, 'organization', None)
                    if user_org and user_org != organization:
                        return HttpResponseForbidden("You do not have permission to access this organization.")
            except Organization.DoesNotExist:
                request.organization = None
        else:
            # Fallback to user's primary organization if no subdomain (useful for localhost development)
            if request.user.is_authenticated:
                request.organization = getattr(request.user, 'organization', None)
            else:
                request.organization = None

        response = self.get_response(request)
        return response
