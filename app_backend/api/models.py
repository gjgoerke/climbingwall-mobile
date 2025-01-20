from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Avg 
from django.core.validators import MinValueValidator, MaxValueValidator

from django.db.models.signals import post_save
from django.dispatch import receiver

# ---- USERS ----
# User Model for authentication only.
class User(AbstractUser):
    email = models.EmailField(unique=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f'{self.user.username}\'s Profile'
    
# ---- Boards ----
class Board(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name='owned_boards')

    #Location
    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        null=True,
        blank=True
    )

    # Board characteristics
    angle = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(90)])
    led_quantity =  models.IntegerField(default=0)

    date_created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name} ({self.city})"
    

# ---- Climbs ----
class BaseClimb(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date_set = models.DateTimeField(auto_now_add=True)
    board = models.ForeignKey(Board, on_delete=models.PROTECT, related_name='climbs')
    setter = models.ForeignKey(User, on_delete=models.PROTECT, related_name='set_climbs')
    first_ascentionist = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='first_ascents',
        blank=True,
        null=True
    )
    draft = models.BooleanField(default=True)
    rating = models.SmallIntegerField(
        choices=RATING_CHOICES,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    class Meta:
        abstract = True

class Boulder(BaseClimb):
    fa_grade = models.IntegerField(blank=True, null=True)

    # Averages each individual users propsed grades then averages all the averaged grades and rounds.
    @property 
    def consensus_grade(self):
        result = self.ascents.exclude(proposed_grade__isnull=True)\
            .values('user')\
            .annotate(avg_grade =  Avg('proposed_grade'))\
            .aggregate(Avg('avg_grade'))
        return round(result['avg_grade__avg']) if result['avg_grade__avg'] is not None else None

    def __str__(self):
        return f"{self.name} - Grade {self.consensus_grade or 'Unknown'}"

# ---- Attempts ----


# ---- Ascents ---- 
class Ascent(models.Model):
    boulder = models.ForeignKey(Boulder, on_delete=models.PROTECT, related_name='ascents')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ascents')
    date_time = models.DateTimeField(auto_now_add=True)
    proposed_grade = models.IntegerField()
    def __str__(self):
        return f"{self.user.username}'s ascent of {self.boulder.name}"

# ---- Signals ----
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()