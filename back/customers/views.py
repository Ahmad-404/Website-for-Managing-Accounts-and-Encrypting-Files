from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Customer, Social, Log
from .serializers import CustomerModelSerializer, SocialModelSerializer, SocialModelReadSerializer, LogModelSerializer, FileSerializer




@api_view(['POST'])
def checkUser(request):
    data = request.data
    client= Customer.objects.filter(username= data['username'], 
                                  password= data['password']).first()
    if client:
        serializer = CustomerModelSerializer(client)
        return Response(serializer.data, status= status.HTTP_200_OK)
    return Response({"error":"username error"}, status= status.HTTP_404_NOT_FOUND)  

@api_view(['POST'])
def addUser(request):
    data= request.data
    serializer= CustomerModelSerializer(data= data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status= status.HTTP_200_OK)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getAllSocials(request, id):
    socials = Social.objects.filter(customer= id)
    serializer = SocialModelReadSerializer(socials, many= True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def newSocials(request, id):
    socials = Social.objects.get(pk= id)
    Log.objects.create(
        social= socials
    )
    return Response({}, status=status.HTTP_200_OK)

@api_view(['GET'])
def getAllSocialsLog(request, id):
    socials = Log.objects.filter(social= id)
    serializer = LogModelSerializer(socials, many= True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create(request):
    socials = SocialModelSerializer(data= request.data)
    if socials.is_valid():
        socials.save()
        return Response(socials.data, status=status.HTTP_200_OK)
    return Response(socials.errors, status=status.HTTP_400_BAD_REQUEST)



from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

class EncryptFileView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file_obj = request.data['file']
        key = get_random_bytes(16)
        cipher = AES.new(key, AES.MODE_EAX)
        ciphertext, tag = cipher.encrypt_and_digest(file_obj.read())
        with open('encrypted_file', 'wb') as f_out:
            [f_out.write(x) for x in (cipher.nonce, tag, ciphertext)]
        with open('key_file', 'wb') as f_key:
            f_key.write(key)
        return HttpResponse(status=204)

class DecryptFileView(APIView):

    def get(self, request):
        with open('key_file', 'rb') as f_key:
            key = f_key.read()
        with open('encrypted_file', 'rb') as f_in:
            nonce, tag, ciphertext = [f_in.read(x) for x in (16, 16, -1)]
        cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
        data = cipher.decrypt_and_verify(ciphertext, tag)
        with open('decrypted_file.png', 'wb') as f_out:
            f_out.write(data)
        return HttpResponse(status=204)
