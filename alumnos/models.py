from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    telefono = models.CharField(max_length=15)
    
    # Añadir related_name para evitar conflictos
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

class Producto(models.Model):
    MARCAS = [
        ('NIKE', 'Nike'),
        ('ADIDAS', 'Adidas'),
        ('NEW_BALANCE', 'New Balance'),
        ('VANS', 'Vans'),
    ]
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField()
    marca = models.CharField(max_length=20, choices=MARCAS)

    def __str__(self):
        return self.nombre

class Genero(models.Model):
    id_genero = models.AutoField(db_column='idGenero', primary_key=True) 
    genero = models.CharField(max_length=20, blank=False, null=False)

    def __str__(self):
        return str(self.genero)

class Alumno(models.Model):
    rut = models.CharField(primary_key=True, max_length=10)
    nombre = models.CharField(max_length=20)
    apellido_paterno = models.CharField(max_length=20)
    apellido_materno = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField(blank=False, null=False) 
    id_genero = models.ForeignKey(Genero, on_delete=models.CASCADE, db_column='idGenero')  
    telefono = models.CharField(max_length=45)
    email = models.EmailField(unique=True, max_length=100, blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)  
    activo = models.IntegerField()

    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno}"