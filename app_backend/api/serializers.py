from rest_framework import serializers
from .models import Boulder, User, Board, Ascent


        
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
    def get_ascentionist_count(self, obj):
        return getattr(obj, 'ascentionist_count', 0)
    
    class Meta:
        model = Boulder
        fields = ['id', 'name', 'description', 'date_set', 'board', 'setter',
                    'first_ascentionist', 'draft', 'rating', 'fa_grade', 'ascentionist_count']

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Board
        fields = ['name', 'description', 'owner', 'angle', 'city', 'latitude', 'longitude', 'led_quantity']