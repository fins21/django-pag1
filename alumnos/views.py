from django.shortcuts import render

# Create your views here.

def index(request):
    return render( request, 'alumnos/index.html')

def nosotros (request):
    return render (request, 'alumnos/nosotros.html')

def carrito (request):
    return render (request, 'alumnos/carrito.html')

def adidas (request):
    return render (request, 'alumnos/adidas.html')

def new (request):
    return render (request, 'alumnos/new.html')

def vans (request):
    return render (request, 'alumnos/vans.html')

def nike (request):
    return render (request, 'alumnos/nike.html')

def registro (request):
    return render (request, 'alumnos/registro.html')

