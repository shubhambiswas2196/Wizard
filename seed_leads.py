import os
import django
import random
from faker import Faker

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Wizard.settings')
django.setup()

from crm.models import Lead
from accounts.models import Organization

def seed_leads(count=1000):
    fake = Faker()
    org = Organization.objects.first()
    
    if not org:
        print("No organization found. Please create one first.")
        return

    print(f"Seeding {count} leads for organization: {org.name}")
    
    status_choices = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']
    source_choices = ['WEB', 'REFERRAL', 'COLD_CALL', 'ADS', 'OTHER']
    
    leads = []
    for _ in range(count):
        lead = Lead(
            organization=org,
            name=fake.name(),
            email=fake.email(),
            phone=fake.phone_number()[:20],
            status=random.choice(status_choices),
            company=fake.company(),
            address=fake.street_address(),
            city=fake.city(),
            state=fake.state(),
            zip_code=fake.zipcode(),
            country=fake.country(),
            website=fake.url(),
            source=random.choice(source_choices),
            assigned_to=fake.name()
        )
        leads.append(lead)
    
    # Bulk create for efficiency
    Lead.objects.bulk_create(leads)
    print(f"Successfully seeded {count} leads!")

if __name__ == '__main__':
    seed_leads(1000)
