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
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.shortcuts import render, redirect
from .models import Credenciales
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseRedirect
import json
from .models import Producto, MensajeContacto, Credenciales
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login

def index(request):
    productos = Producto.objects.all()[:6]  # Mostrar los primeros 6 productos
    return render(request, 'alumnos/index.html', {'productos': productos})

def nosotros(request):
    return render(request, 'alumnos/nosotros.html')

def carrito(request):
    return render(request, 'alumnos/carrito.html')

def adidas(request):
    productos = Producto.objects.filter(id='6').all
    return render(request, 'alumnos/adidas.html', {'productos': productos})

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

from django.http import JsonResponse

def obtener_stock(request):
    productos = Producto.objects.all()
    data = [
        {
            'nombre': producto.nombre,
            'precio': producto.precio,
            'stock': producto.stock
        }
        for producto in productos
    ]
    return JsonResponse({'productos': data})

import logging
logger = logging.getLogger(__name__)

@require_POST
@csrf_exempt
def actualizar_stock(request):
    try:
        data = json.loads(request.body)
        logger.info(f"Datos recibidos en actualizar_stock: {data}")
        
        if not data:
            return JsonResponse({'success': False, 'error': 'No se recibieron datos'}, status=400)
        
        for item in data:
            producto = Producto.objects.get(id=item['id'])
            if producto.stock >= item['cantidad']:
                producto.stock -= item['cantidad']
                producto.save()
                logger.info(f"Stock actualizado para producto {producto.id}. Nuevo stock: {producto.stock}")
            else:
                logger.warning(f"Stock insuficiente para producto {producto.id}")
                return JsonResponse({'success': False, 'error': f'Stock insuficiente para {producto.nombre}'}, status=400)
        
        return JsonResponse({'success': True})
    except Producto.DoesNotExist as e:
        logger.error(f"Producto no encontrado: {str(e)}")
        return JsonResponse({'success': False, 'error': 'Producto no encontrado'}, status=404)
    except json.JSONDecodeError as e:
        logger.error(f"Error al decodificar JSON: {str(e)}")
        return JsonResponse({'success': False, 'error': 'Datos inválidos'}, status=400)
    except Exception as e:
        logger.error(f"Error inesperado en actualizar_stock: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Producto, Compra, DetalleCompra
logger = logging.getLogger(__name__)


@require_POST
@csrf_exempt
@transaction.atomic
def realizar_compra(request):
    logger.info("Intentando realizar compra")
    try:
        data = json.loads(request.body)
        logger.info(f"Datos recibidos: {data}")
        compra = Compra.objects.create()  # Creamos la compra sin asociarla a un usuario
        logger.info(f"Compra creada con ID: {compra.id}")
        
        total_compra = 0
        for item in data:
            logger.info(f"Procesando item: {item}")
            producto = Producto.objects.select_for_update().get(id=item['id'])
            cantidad = int(item['cantidad'])
            logger.info(f"Producto {producto.id} - Stock actual: {producto.stock}, Cantidad solicitada: {cantidad}")
            if producto.stock >= cantidad:
                producto.stock -= cantidad
                producto.save()
                logger.info(f"Stock actualizado para producto {producto.id}. Nuevo stock: {producto.stock}")

                
                subtotal = producto.precio * cantidad
                DetalleCompra.objects.create(
                    compra=compra,
                    producto=producto,
                    cantidad=cantidad,
                    precio_unitario=producto.precio,
                    subtotal=subtotal
                )
                logger.info(f"Detalle de compra creado: {DetalleCompra.id}")

                total_compra += subtotal
            else:
                logger.warning(f"Stock insuficiente para producto {producto.id}")

                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'error': f'Stock insuficiente para {producto.nombre}'
                }, status=400)
        
        compra.total = total_compra
        compra.save()
        logger.info(f"Compra finalizada. Total: {total_compra}")
        
        return JsonResponse({
            'success': True,
            'mensaje': 'Compra realizada con éxito',
            'compra_id': compra.id
        })
    except Producto.DoesNotExist:
        logger.error(f"Error durante la compra: {str(e)}")
        transaction.set_rollback(True)
        return JsonResponse({'success': False, 'error': 'Producto no encontrado'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Datos de compra inválidos'}, status=400)
    except Exception as e:
        transaction.set_rollback(True)
        return JsonResponse({'success': False, 'error': str(e)}, status=500)