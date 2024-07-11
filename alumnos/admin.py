from django.contrib import admin
from .models import Producto, Credenciales, Usuario # Importa todos tus modelos aquí
from .models import Producto, MensajeContacto
from . import views

@admin.register(Credenciales)
class CredencialesAdmin(admin.ModelAdmin):
    list_display = ['username']
    search_fields = ['username']
admin.site.register(Usuario)
admin.site.register(Producto)


