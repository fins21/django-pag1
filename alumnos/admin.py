from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Producto, Genero, Alumno  # Importa todos tus modelos aquí

admin.site.register(Usuario, UserAdmin)
admin.site.register(Producto)
