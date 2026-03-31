import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Wizard.settings')
django.setup()

from accounts.models import Organization, User
from crm.models import Lead, Deal

# Create Org A
org_a, _ = Organization.objects.get_or_create(slug='techshu', defaults={'name': 'Techshu'})
user_a, created = User.objects.get_or_create(
    email='admin@techshu.com',
    defaults={'first_name': 'Tech', 'last_name': 'Admin', 'organization': org_a}
)
if created: user_a.set_password('password123'); user_a.save()

# Create Org B 
org_b, _ = Organization.objects.get_or_create(slug='qa-org', defaults={'name': 'QA Org'})
user_b, created = User.objects.get_or_create(
    email='admin@qa.com',
    defaults={'first_name': 'QA', 'last_name': 'Admin', 'organization': org_b}
)
if created: user_b.set_password('password123'); user_b.save()

# Add Lead to Org A
Lead.objects.get_or_create(
    organization=org_a,
    name='John Doe',
    email='john@example.com',
    status='NEW'
)

# Add Lead to Org B
Lead.objects.get_or_create(
    organization=org_b,
    name='Jane Smith',
    email='jane@example.com',
    status='QUALIFIED'
)

print("Verification data created.")
