from rest_framework import serializers
from .models import Boulder, User, Board, Ascent

class BoulderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boulder
        fields = ['id', 'name', 'description', 'date_set', 'board', 'setter',
                    'first_ascentionist', 'draft', 'rating', 'fa_grade', 'ascentionist_count']
        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'birthday']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'birthday': {'required': True}
        }
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)