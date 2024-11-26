from rest_framework import serializers
from .models import Customer, Social, Log

from cryptography.fernet import Fernet

class CustomerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model= Customer
        fields= '__all__'
        
class LogModelSerializer(serializers.ModelSerializer):
    class Meta:
        model= Log
        fields= '__all__'
        
class SocialModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Social
        fields= ['id', 'customer', 'account', 'username', 'password', 'url', 'updated_at']
        
    def create(self, validated_data):
        with open("secrit_key.pem", 'rb') as file:
            secret_key = file.read()
        f = Fernet(secret_key)
        message =str(validated_data['password'])
        ciphertext = f.encrypt(message.encode())
        return Social.objects.create(
            customer=validated_data['customer'],
            account = validated_data['account'],
            username = validated_data['username'],
            password= ciphertext,
            url =validated_data['url']
        )
        
class SocialModelReadSerializer(serializers.ModelSerializer):
    logs= LogModelSerializer(many=True)
    newpass = serializers.SerializerMethodField(read_only= True)
    def get_newpass(self, obj):
        pass1= obj.password[2:len(obj.password)-1]
        with open("secrit_key.pem", 'rb') as file:
            secret_key = file.read()
        f = Fernet(secret_key)
        decrypted_text = f.decrypt(pass1.encode())
        return str(decrypted_text.decode())
    
    class Meta:
        model = Social
        fields= ['id', 'customer', 'account', 'username', 'password', 'url', 'updated_at', 'newpass', "logs"]
        
        
class FileSerializer(serializers.Serializer):
    file = serializers.FileField()
