"""instituto URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# Asegúrate de importar la vista adecuada
from alumnos.views import index
from alumnos.views import nosotros
from alumnos.views import registro

urlpatterns = [
    path('admin/', admin.site.urls),
    path('alumnos/', include('alumnos.urls')),
    # Agrega una nueva ruta para la URL raíz aquí
    path('', index, name='home'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('alumnos/', include('alumnos.urls')),
    # Agrega una nueva ruta para la URL raíz aquí
    path('', nosotros, name='home'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('alumnos/', include('alumnos.urls')),
    # Agrega una nueva ruta para la URL raíz aquí
    path('', registro, name='home'),
]