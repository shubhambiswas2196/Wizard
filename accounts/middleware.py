from .models import Organization

class SubdomainMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':')[0]
        host_parts = host.split('.')
        
        # Expecting something like techshu.wizard.com or techshu.localhost
        # For local testing, we might use techshu.localhost:8000
        if len(host_parts) >= 2 and host_parts[-1] == 'localhost':
            subdomain = host_parts[0]
            try:
                request.organization = Organization.objects.get(slug=subdomain)
            except Organization.DoesNotExist:
                request.organization = None
        elif len(host_parts) > 2:
            subdomain = host_parts[0]
            try:
                request.organization = Organization.objects.get(slug=subdomain)
            except Organization.DoesNotExist:
                request.organization = None
        else:
            request.organization = None

        response = self.get_response(request)
        return response
