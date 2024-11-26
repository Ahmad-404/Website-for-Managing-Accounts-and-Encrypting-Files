from django.urls import path
from . import views

urlpatterns = [
    path('check-user/', view= views.checkUser),
    path('add-user/', view= views.addUser),
    path('socials/<int:id>/', view= views.getAllSocials),
    path('socials/create/', view= views.create),
    path('log/add/<int:id>/', view= views.newSocials),
    path('log/<int:id>/', view= views.getAllSocialsLog),
    path('encrypt/', views.EncryptFileView.as_view(), name='encrypt_file'),
    path('decrypt/', views.DecryptFileView.as_view(), name='decrypt_file'),
]