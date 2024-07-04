from django.urls import path 
from . import views

urlpatterns = [   
    path('', views.index, name='index'), 
    path('nosotros/', views.nosotros, name='nosotros'), 
    path('nike/', views.nike, name='nike'), 
    path('adidas/', views.adidas, name='adidas'), 
    path('new/', views.new, name='new'), 
    path('vans/', views.vans, name='vans'), 
    path('carrito/', views.carrito, name='carrito'), 
    path('registro/', views.registro, name='registro'), 
]