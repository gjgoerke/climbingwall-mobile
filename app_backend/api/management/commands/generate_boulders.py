from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Boulder, Board
from django.utils import timezone
import random
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Generates sample boulder problems'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Number of boulders to generate')

    def handle(self, *args, **kwargs):
        count = kwargs['count']
        
        user, _ = User.objects.get_or_create(
            username="bob",
            defaults={'email': 'bob@example.com'}
        )
        if not user.password:
            user.set_password('password')
            user.save()

        # Then create the board with the user instance
        board, _ = Board.objects.get_or_create(
            name="Main Wall",
            defaults={
                'owner': user,  # Pass the user instance, not get_or_create result
                'angle': 43,
                'city': 'Squamish',
                'address': '420 Send St.',
                'description': 'A classic Spray'
            }
        )
        adjectives = ['Crimpy', 'Slopey', 'Dynamic', 'Technical', 'Powerful', 
                        'Delicate', 'Balancy', 'Steep', 'Overhung', 'Vertical']
        nouns = ['Traverse', 'Dyno', 'Project', 'Problem', 'Line', 
                    'Boulder', 'Route', 'Challenge', 'Sequence', 'Climb']
        descriptions = [
            "A classic test piece",
            "Powerful moves between good holds",
            "Technical climbing on small crimps",
            "Big moves on slopers",
            "Delicate balance required",
            "A test of endurance",
            "Precise footwork needed",
            "Dynamic moves to decent holds",
            "Core tension throughout",
            "Pure power required"
        ]

        for i in range(count):
            name = f"{random.choice(adjectives)} {random.choice(nouns)}"
            description = random.choice(descriptions)
            date_set = timezone.now() - timedelta(days=random.randint(0, 365))
            rating = random.randint(1, 5)
            fa_grade = random.randint(0, 12)  # V0-V12
            draft = random.random() < 0.2  # 20% chance of being a draft

            boulder = Boulder.objects.create(
                name=name,
                description=description,
                date_set=date_set,
                board=board,
                setter=user,
                first_ascentionist=user if random.random() < 0.7 else None,  # 70% chance of FA
                draft=draft,
                rating=rating,
                fa_grade=fa_grade if not draft else None
            )

            # Generate some ascents
            ascent_count = random.randint(0, 100)
            for _ in range(ascent_count):
                proposed_grade = max(0, min(fa_grade + random.randint(-2, 2), 12))
                boulder.ascents.create(
                    user=user,
                    proposed_grade=proposed_grade
                )

            self.stdout.write(
                self.style.SUCCESS(f'Created boulder "{name}" with {ascent_count} ascents')
            )