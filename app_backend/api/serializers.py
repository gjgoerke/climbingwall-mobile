from rest_framework import serializers
from .models import Boulder, User, Board, Ascent, LedConfig, LikedBoulder


        
# ---- User Serializers ----
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'write_only': True, 'required': True}
        }
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class BoulderSerializer(serializers.ModelSerializer):
    ascentionist_count = serializers.SerializerMethodField()
    setter = UserSerializer(read_only = True)
    first_ascentionist = UserSerializer(read_only=True)
    board = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_ascentionist_count(self, obj):
        return getattr(obj, 'ascentionist_count', 0)
    
    class Meta:
        model = Boulder
        fields = ['id', 'name', 'description', 'date_set', 'board', 'setter',
                    'first_ascentionist', 'draft', 'like_count', 'fa_grade', 'ascentionist_count', 'holds']
        
class LikedBoulderSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikedBoulder
        fields = ['boulder', 'user']
        read_only_fields = ['boulder', 'user']
        
class AscentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # Replace the boulder field with a PrimaryKeyRelatedField
    boulder = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Ascent
        fields = ['id', 'user', 'boulder', 'date_time', 'proposed_grade', 'comment']
class AscentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ascent
        fields = ['proposed_grade', 'attempts', 'date_time', 'comment']  # Only fields the user should provide
    

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Board
        fields = ['name', 'id', 'description', 'owner', 'image', 'angle',
                   'city', 'latitude', 'longitude', 'led_quantity']

class LedConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = LedConfig
        fields = ['board', 'hold_data']