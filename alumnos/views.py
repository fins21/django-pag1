from django.shortcuts import render, redirect
from django.contrib.auth import login
from .models import Producto, Usuario
from django.contrib.auth.forms import UserCreationForm
from .forms import RegistroForm

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

def registro(request):
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            usuario = form.save(commit=False)
            usuario.clean()
            usuario.save()
            return redirect('login')
    else:
        form = RegistroForm()
    return render(request, 'alumnos/registro.html', {'form': form})