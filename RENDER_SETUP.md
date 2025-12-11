# Configuración de Render para zplendid-form

## Problema: Error ETIMEDOUT en Render

Si estás experimentando el error `ETIMEDOUT` al intentar hacer login en tu instancia de Render, sigue estos pasos:

## 1. Configurar Variables de Entorno en Render

### Paso 1: Acceder a la configuración
1. Ve a tu dashboard de Render: https://dashboard.render.com
2. Selecciona tu servicio (Web Service)
3. Ve a la sección **"Environment"** en el menú lateral

### Paso 2: Agregar variables de entorno
Agrega las siguientes variables de entorno **obligatorias**:

```
DB_HOST=tu-host-de-mysql
DB_USER=tu-usuario-mysql
DB_PASSWORD=tu-contraseña-mysql
DB_NAME=nombre-de-tu-base-de-datos
DB_PORT=3306
JWT_SECRET=tu-jwt-secret-muy-seguro-aqui-2024
```

### Paso 3: Variables opcionales
Si tu base de datos requiere SSL, agrega:
```
DB_SSL=true
```

## 2. Verificar Acceso a la Base de Datos

### Si usas MySQL en Render:
1. Ve a tu servicio de MySQL en Render
2. Copia el **Internal Database URL** o las credenciales individuales
3. Usa el **host interno** si tu app y DB están en el mismo servicio
4. Usa el **host externo** si están en servicios separados

### Si usas MySQL externo (PlanetScale, AWS RDS, etc.):
1. **Verifica que el firewall permita conexiones desde Render:**
   - Render usa IPs dinámicas, pero puedes:
     - Permitir todas las IPs (menos seguro)
     - Usar un túnel VPN
     - Configurar whitelist de IPs si tu proveedor lo permite

2. **Verifica las credenciales:**
   - Usuario y contraseña correctos
   - Base de datos existe
   - Usuario tiene permisos necesarios

## 3. Verificar Logs en Render

Después de configurar las variables de entorno:

1. Ve a la sección **"Logs"** de tu servicio
2. Busca estos mensajes al iniciar:
   - ✅ `Pool MySQL inicializado`
   - ✅ `Conexión a MySQL verificada exitosamente`
   - 🔧 `Database config:` (debe mostrar host, user, database, port)

3. Si ves errores, revisa:
   - Variables de entorno están correctamente escritas
   - No hay espacios extra en los valores
   - El host es accesible desde Render

## 4. Solución de Problemas Comunes

### Error: "Variable de entorno requerida no encontrada"
- **Solución:** Verifica que todas las variables estén configuradas en Render
- Las variables son case-sensitive

### Error: "ETIMEDOUT"
- **Causa:** La base de datos no es accesible desde Render
- **Soluciones:**
  1. Si usas MySQL externo, verifica firewall/IP whitelist
  2. Verifica que el host sea correcto (no `localhost` si la DB está en otro servicio)
  3. Verifica que el puerto sea correcto (3306 por defecto)
  4. Si usas SSL, configura `DB_SSL=true`

### Error: "ER_ACCESS_DENIED_ERROR"
- **Causa:** Credenciales incorrectas
- **Solución:** Verifica `DB_USER` y `DB_PASSWORD`

### Error: "Unknown database"
- **Causa:** La base de datos no existe
- **Solución:** Crea la base de datos o verifica `DB_NAME`

## 5. Ejemplo de Configuración

### Para MySQL en Render (mismo servicio):
```
DB_HOST=d-xxxxx.mysql.region.rds.aws.com
DB_USER=admin
DB_PASSWORD=tu-password-seguro
DB_NAME=zplendid_db
DB_PORT=3306
JWT_SECRET=tu-jwt-secret-super-seguro-minimo-32-caracteres
```

### Para MySQL externo (PlanetScale, AWS RDS, etc.):
```
DB_HOST=tu-host-externo.mysql.database.azure.com
DB_USER=admin@servidor
DB_PASSWORD=tu-password
DB_NAME=zplendid_db
DB_PORT=3306
DB_SSL=true
JWT_SECRET=tu-jwt-secret-super-seguro-minimo-32-caracteres
```

## 6. Después de Configurar

1. **Reinicia el servicio** en Render (botón "Manual Deploy" o espera auto-deploy)
2. **Verifica los logs** para confirmar conexión exitosa
3. **Prueba el login** desde la aplicación

## 7. Verificación Rápida

Puedes verificar que las variables están configuradas correctamente revisando los logs de inicio. Deberías ver:

```
🔧 Database config: {
  host: 'tu-host',
  user: 'tu-usuario',
  database: 'tu-database',
  port: 3306,
  hasPassword: true
}
✅ Pool MySQL inicializado
✅ Conexión a MySQL verificada exitosamente
```

Si no ves estos mensajes o ves errores, revisa la configuración.

## Notas Importantes

- ⚠️ **Nunca** subas archivos `.env` al repositorio
- ✅ Las variables de entorno en Render son seguras y no se exponen
- 🔒 Usa un `JWT_SECRET` fuerte y único
- 🌐 Si tu DB está en otro proveedor, verifica configuración de red/firewall
