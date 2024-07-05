from django.shortcuts import render, redirect
from django.contrib.auth import login
from .models import Producto
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseRedirect
import json
from .models import Producto, MensajeContacto, Credenciales
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth import authenticate, login
from .forms import UsuarioForm



def index(request):
    productos = Producto.objects.all()[:6]  # Mostrar los primeros 6 productos
    return render(request, 'alumnos/index.html', {'productos': productos})

def nosotros(request):
    return render(request, 'alumnos/nosotros.html')

def carrito(request):
    return render(request, 'alumnos/carrito.html')

def adidas(request):
    productos = Producto.objects.filter(marca='adidas')
    return render(request, 'alumnos/adidas.html', {'productos': productos})

def new(request):
    productos = Producto.objects.filter(marca='new')
    return render(request, 'alumnos/new.html', {'productos': productos})

def vans(request):
    productos = Producto.objects.filter(marca='VANS')
    return render(request, 'alumnos/vans.html', {'productos': productos})

def nike(request):
    productos = Producto.objects.filter(marca='NIKE')
    return render(request, 'alumnos/nike.html', {'productos': productos})


from django.contrib.auth.hashers import make_password

def registro_usuario(request):
    if request.method == 'POST':
        form = UsuarioForm(request.POST)
        if form.is_valid():
            usuario = form.save(commit=False)
            usuario.contraseña = make_password(form.cleaned_data['contraseña'])
            usuario.save()
            # Redirige al usuario a donde desees después del registro exitoso
            return redirect('index')
    else:
        form = UsuarioForm()
    return render(request, 'alumnos/RegistroUsuario.html', {'form': form})
