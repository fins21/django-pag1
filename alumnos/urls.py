from django.urls import path 
from . import views
from .views import obtener_stock
from .views import realizar_compra
from .views import actualizar_stock

urlpatterns = [   
    path('', views.index, name='index'), 
    path('nosotros/', views.nosotros, name='nosotros'), 
    path('adidas/', views.adidas, name='adidas'), 
    path('carrito/', views.carrito, name='carrito'), 
    path('RegistroUsuario/', views.registro_usuario, name='RegistroUsuario'), 
    path('actualizar-stock/', views.actualizar_stock, name='actualizar_stock'),
    path('realizar-compra/', views.realizar_compra, name='realizar_compra'),

]