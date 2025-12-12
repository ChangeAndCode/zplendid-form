# 🧪 GUÍA PARA PROBAR EL SISTEMA DE CITAS LOCALMENTE

## 📋 Requisitos Previos

1. **Servidor de desarrollo corriendo:**
   ```bash
   npm run dev
   ```

2. **Base de datos MongoDB conectada** (verificar que `MONGODB_URI` esté configurada en `.env.local`)

3. **Tener al menos:**
   - 1 usuario con rol `doctor` (aprobado)
   - 1 usuario con rol `user` (paciente)

---

## 🚀 PASOS PARA PROBAR

### 1. Verificar que tienes doctores en el sistema

**Opción A: Si ya tienes doctores creados**
- Ve al panel de administrador: `http://localhost:3000/admin`
- Verifica que tengas doctores aprobados (`isApproved: true`)
- Verifica que tengan especialidades configuradas

**Opción B: Crear un doctor nuevo**
- Ve a `http://localhost:3000/admin`
- Pestaña "Gestión de Doctores"
- Click en "Agregar Doctor"
- Completa el formulario:
  - Email: `doctor@test.com`
  - Contraseña: `password123`
  - Nombre y Apellido
  - Número de Licencia: `LIC12345`
  - Especialidades: `Cirugía Plástica` (o la que prefieras)
- Guarda y aprueba el doctor

### 2. Configurar horarios del doctor

1. **Inicia sesión como doctor:**
   - Ve a `http://localhost:3000/`
   - Login con las credenciales del doctor
   - Serás redirigido a `/doctor/dashboard`

2. **Configurar horarios:**
   - Click en "Configurar Horarios" o ve a `http://localhost:3000/doctor/schedule`
   - Para cada día de la semana que quieras estar disponible:
     - Marca "Disponible"
     - Establece hora de inicio (ej: `09:00`)
     - Establece hora de fin (ej: `17:00`)
     - Click en "Guardar"
   - **Recomendación:** Configura al menos Lunes a Viernes de 9:00 a 17:00

### 3. Probar como paciente - Agendar una cita

1. **Inicia sesión como paciente:**
   - Ve a `http://localhost:3000/`
   - Login con un usuario que tenga rol `user`
   - Serás redirigido a `/dashboard`

2. **Agendar cita:**
   - Click en "Agendar Cita" o ve a `http://localhost:3000/appointments/book`
   - Completa el formulario:
     - **Especialidad:** Selecciona la especialidad del doctor (ej: `Cirugía Plástica`)
     - **Doctor:** Aparecerá el doctor disponible, selecciónalo
     - **Fecha:** Selecciona una fecha futura (no puede ser hoy si ya pasó la hora)
     - **Hora:** Selecciona uno de los horarios disponibles
     - **Motivo (opcional):** Describe el motivo de la cita
   - Click en "Agendar Cita"
   - Deberías ver un mensaje de éxito y ser redirigido a "Mis Citas"

### 4. Ver citas como paciente

1. **Ver mis citas:**
   - Ve a `http://localhost:3000/appointments/my-appointments`
   - Deberías ver la cita que acabas de agendar
   - Puedes filtrar por: Todas, Próximas, Pasadas, Canceladas

2. **Cancelar una cita (opcional):**
   - En la lista de citas, click en "Cancelar"
   - Confirma la cancelación
   - La cita cambiará de estado a "Cancelada"

### 5. Probar como doctor - Ver agenda

1. **Inicia sesión como doctor** (si no estás ya logueado)

2. **Ver dashboard:**
   - Ve a `http://localhost:3000/doctor/dashboard`
   - Deberías ver:
     - Estadísticas (citas de hoy, próximas)
     - Lista de citas del día
     - Próximas citas

3. **Ver agenda completa:**
   - Click en "Ver Agenda Completa" o ve a `http://localhost:3000/doctor/appointments`
   - Deberías ver todas tus citas
   - Puedes filtrar por fecha y estado

4. **Actualizar estado de una cita:**
   - En la lista de citas, verás botones según el estado:
     - Si está "Programada": puedes "Confirmar"
     - Puedes marcar como "Completada"
   - Click en el botón correspondiente
   - El estado se actualizará

### 6. Ver pacientes del doctor

1. **Ver lista de pacientes:**
   - Ve a `http://localhost:3000/doctor/patients`
   - Deberías ver todos los pacientes que tienen citas contigo
   - Se muestra el número total de citas por paciente

---

## 🧪 CASOS DE PRUEBA ESPECÍFICOS

### ✅ Caso 1: Agendar cita exitosamente
- **Pasos:**
  1. Login como paciente
  2. Ir a agendar cita
  3. Seleccionar especialidad, doctor, fecha y hora disponibles
  4. Confirmar
- **Resultado esperado:** Cita creada, mensaje de éxito, redirección a "Mis Citas"

### ✅ Caso 2: Intentar agendar en horario no disponible
- **Pasos:**
  1. Agendar una cita a las 10:00
  2. Intentar agendar otra cita al mismo doctor a las 10:15 (mismo día)
- **Resultado esperado:** Error "El horario seleccionado no está disponible"

### ✅ Caso 3: Intentar agendar en el pasado
- **Pasos:**
  1. Seleccionar una fecha pasada o una hora que ya pasó hoy
- **Resultado esperado:** No debería permitir agendar o mostrar error

### ✅ Caso 4: Doctor configura horarios
- **Pasos:**
  1. Login como doctor
  2. Ir a "Configurar Horarios"
  3. Configurar varios días con diferentes horarios
  4. Guardar
- **Resultado esperado:** Horarios guardados, disponibles para agendar

### ✅ Caso 5: Doctor actualiza estado de cita
- **Pasos:**
  1. Login como doctor
  2. Ver agenda
  3. Cambiar estado de una cita (Confirmar, Completar)
- **Resultado esperado:** Estado actualizado, visible en la lista

### ✅ Caso 6: Paciente cancela cita
- **Pasos:**
  1. Login como paciente
  2. Ver mis citas
  3. Cancelar una cita futura
- **Resultado esperado:** Cita cancelada, aparece en filtro "Canceladas"

---

## 🔍 VERIFICACIONES ADICIONALES

### Verificar en la base de datos (opcional)

Si quieres verificar que los datos se guardaron correctamente en MongoDB:

```javascript
// Conecta a MongoDB y verifica las colecciones:
db.appointments.find().pretty()
db.doctor_schedules.find().pretty()
db.doctor_availabilities.find().pretty()
```

### Verificar logs del servidor

Observa la consola donde corre `npm run dev` para ver:
- Si hay errores
- Si los índices se crean automáticamente
- Si las consultas se ejecutan correctamente

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema: No aparecen doctores disponibles
**Solución:**
- Verifica que el doctor esté aprobado (`isApproved: true`)
- Verifica que tenga especialidades configuradas
- Verifica que la especialidad coincida exactamente (case-sensitive)

### Problema: No hay horarios disponibles
**Solución:**
- El doctor debe configurar sus horarios primero
- Verifica que el día seleccionado tenga horario configurado
- Verifica que la hora esté dentro del rango configurado

### Problema: Error al agendar cita
**Solución:**
- Verifica que el paciente tenga un `patientId` (se crea automáticamente al registrarse)
- Verifica la consola del navegador (F12) para ver errores
- Verifica los logs del servidor

### Problema: No puedo acceder como doctor
**Solución:**
- Verifica que el usuario tenga rol `doctor`
- Verifica que el doctor esté aprobado
- Verifica que el token JWT sea válido

---

## 📝 NOTAS

- Los índices se crean automáticamente la primera vez que usas cada colección
- No necesitas ejecutar `init-appointments-tables` manualmente
- Las citas tienen duración de 30 minutos por defecto
- Los horarios se configuran por día de la semana (0=Domingo, 6=Sábado)

---

## 🎯 FLUJO COMPLETO RECOMENDADO

1. **Admin crea y aprueba doctor** → `/admin`
2. **Doctor configura horarios** → `/doctor/schedule`
3. **Paciente agenda cita** → `/appointments/book`
4. **Doctor ve la cita en su agenda** → `/doctor/appointments`
5. **Doctor confirma la cita** → Click en "Confirmar"
6. **Paciente ve su cita confirmada** → `/appointments/my-appointments`
7. **Después de la cita, doctor marca como completada** → Click en "Completar"

¡Listo! El sistema está funcionando correctamente. 🎉
