#!/bin/bash

echo "=== Prueba de la API Task Management ==="

# 1. Verificar que la API está activa
echo -e "\n1. Verificando que la API esté activa..."
curl -s http://localhost:3000/health

# 2. Registrar usuario
echo -e "\n\n2. Registrando usuario..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Password123!","firstName":"Test","lastName":"User"}')
echo $REGISTER_RESPONSE

# 3. Login
echo -e "\n\n3. Iniciando sesión..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}')
echo $LOGIN_RESPONSE

# Extraer token (requiere jq, si no está instalado mostrará el response completo)
if command -v jq &> /dev/null; then
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
    echo -e "\nToken obtenido: ${TOKEN:0:50}..."
    
    # 4. Crear tarea
    echo -e "\n\n4. Creando tarea..."
    curl -s -X POST http://localhost:3000/api/v1/tasks \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"title":"Tarea de prueba","description":"Esta es una tarea de prueba"}'
    
    # 5. Listar tareas
    echo -e "\n\n5. Listando tareas..."
    curl -s -X GET http://localhost:3000/api/v1/tasks \
      -H "Authorization: Bearer $TOKEN"
else
    echo -e "\n\nNota: Instala 'jq' para ver las respuestas formateadas"
fi

echo -e "\n\n=== Pruebas completadas ==="
