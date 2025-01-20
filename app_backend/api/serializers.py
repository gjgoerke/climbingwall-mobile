from rest_framework import serializers
from .models import Boulder, User, Board, Ascent

class BoulderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boulder
        fields = ['id', 'name', 'description', 'date_set', 'board', 'setter',
                    'first_ascentionist', 'draft', 'rating', 'fa_grade', 'ascentionist_count']
        
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