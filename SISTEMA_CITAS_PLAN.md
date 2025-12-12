# PLAN DE IMPLEMENTACIÓN: SISTEMA DE CITAS

## 📋 LISTADO DE COMPONENTES A CONSTRUIR

### 1. MODELOS DE DATOS (MongoDB)

#### 1.1 Modelo de Citas (`Appointment`)
- **Colección**: `appointments`
- **Campos**:
  - `_id`: ObjectId
  - `patientId`: string (ID del expediente del paciente)
  - `patientUserId`: ObjectId (referencia a users)
  - `doctorId`: ObjectId (referencia a doctors)
  - `doctorUserId`: ObjectId (referencia a users)
  - `specialty`: string (especialidad requerida)
  - `appointmentDate`: Date (fecha y hora de la cita)
  - `duration`: number (duración en minutos, default: 30)
  - `status`: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  - `reason`: string (motivo de la cita, opcional)
  - `notes`: string (notas del doctor, opcional)
  - `createdAt`: Date
  - `updatedAt`: Date
  - `cancelledAt`: Date (opcional)
  - `cancellationReason`: string (opcional)

#### 1.2 Modelo de Horarios de Doctor (`DoctorSchedule`)
- **Colección**: `doctor_schedules`
- **Campos**:
  - `_id`: ObjectId
  - `doctorId`: ObjectId (referencia a doctors)
  - `dayOfWeek`: number (0-6, donde 0 es domingo)
  - `startTime`: string (formato HH:mm)
  - `endTime`: string (formato HH:mm)
  - `isAvailable`: boolean
  - `createdAt`: Date
  - `updatedAt`: Date

#### 1.3 Modelo de Disponibilidad de Doctor (`DoctorAvailability`)
- **Colección**: `doctor_availabilities`
- **Campos**:
  - `_id`: ObjectId
  - `doctorId`: ObjectId (referencia a doctors)
  - `date`: Date (fecha específica)
  - `startTime`: string (formato HH:mm)
  - `endTime`: string (formato HH:mm)
  - `isAvailable`: boolean
  - `reason`: string (razón si no está disponible, opcional)
  - `createdAt`: Date
  - `updatedAt`: Date

### 2. MODELOS EN CÓDIGO (TypeScript)

#### 2.1 `AppointmentModel.ts`
- `create(appointmentData)`: Crear nueva cita
- `findById(id)`: Buscar cita por ID
- `findByPatientId(patientId)`: Obtener citas de un paciente
- `findByDoctorId(doctorId)`: Obtener citas de un doctor
- `findByDateRange(doctorId, startDate, endDate)`: Citas en rango de fechas
- `updateStatus(id, status)`: Actualizar estado de cita
- `cancel(id, reason)`: Cancelar cita
- `checkAvailability(doctorId, date, time, duration)`: Verificar disponibilidad
- `createTable()`: Crear índices

#### 2.2 `DoctorScheduleModel.ts`
- `create(scheduleData)`: Crear horario
- `findByDoctorId(doctorId)`: Obtener horarios de un doctor
- `update(doctorId, dayOfWeek, scheduleData)`: Actualizar horario
- `delete(doctorId, dayOfWeek)`: Eliminar horario
- `createTable()`: Crear índices

#### 2.3 `DoctorAvailabilityModel.ts`
- `create(availabilityData)`: Crear disponibilidad específica
- `findByDoctorId(doctorId)`: Obtener disponibilidades
- `findByDateRange(doctorId, startDate, endDate)`: Disponibilidades en rango
- `update(id, availabilityData)`: Actualizar disponibilidad
- `delete(id)`: Eliminar disponibilidad
- `createTable()`: Crear índices

### 3. TIPOS TYPESCRIPT

#### 3.1 `types/appointments.ts`
- `Appointment`
- `AppointmentCreate`
- `AppointmentResponse`
- `AppointmentStatus`
- `DoctorSchedule`
- `DoctorScheduleCreate`
- `DoctorAvailability`
- `DoctorAvailabilityCreate`
- `AvailableTimeSlot`
- `AppointmentRequest`

### 4. CONTROLADORES Y RUTAS API

#### 4.1 Para Pacientes (`/api/appointments/`)
- **POST** `/api/appointments/`: Crear nueva cita (requiere autenticación de paciente)
- **GET** `/api/appointments/my-appointments`: Obtener mis citas (requiere autenticación de paciente)
- **GET** `/api/appointments/available-doctors`: Obtener doctores disponibles por especialidad
- **GET** `/api/appointments/available-slots`: Obtener horarios disponibles de un doctor
- **PUT** `/api/appointments/[appointmentId]/cancel`: Cancelar cita (requiere autenticación de paciente)

#### 4.2 Para Doctores (`/api/doctor/`)
- **GET** `/api/doctor/appointments`: Obtener citas del doctor (requiere autenticación de doctor)
- **GET** `/api/doctor/appointments/[appointmentId]`: Obtener detalles de una cita
- **PUT** `/api/doctor/appointments/[appointmentId]/status`: Actualizar estado de cita
- **PUT** `/api/doctor/appointments/[appointmentId]/notes`: Agregar notas a la cita
- **GET** `/api/doctor/schedule`: Obtener horarios del doctor
- **POST** `/api/doctor/schedule`: Crear/actualizar horarios del doctor
- **GET** `/api/doctor/availability`: Obtener disponibilidades específicas
- **POST** `/api/doctor/availability`: Crear disponibilidad específica
- **DELETE** `/api/doctor/availability/[availabilityId]`: Eliminar disponibilidad
- **GET** `/api/doctor/patients`: Obtener lista de pacientes del doctor

#### 4.3 Para Administradores (`/api/admin/appointments/`)
- **GET** `/api/admin/appointments`: Obtener todas las citas (con filtros)
- **GET** `/api/admin/appointments/[appointmentId]`: Obtener detalles de una cita
- **PUT** `/api/admin/appointments/[appointmentId]`: Actualizar cualquier campo de la cita

### 5. PÁGINAS Y COMPONENTES FRONTEND

#### 5.1 Para Pacientes

##### 5.1.1 Página de Agendar Cita (`/appointments/book/page.tsx`)
- Formulario para seleccionar especialidad
- Lista de doctores disponibles por especialidad
- Calendario para seleccionar fecha
- Selector de horario disponible
- Formulario de motivo de la cita
- Confirmación de cita

##### 5.1.2 Página de Mis Citas (`/appointments/my-appointments/page.tsx`)
- Lista de citas del paciente
- Filtros por estado (próximas, pasadas, canceladas)
- Detalles de cada cita
- Opción para cancelar citas futuras
- Vista de calendario (opcional)

##### 5.1.3 Componentes
- `AppointmentBookingForm.tsx`: Formulario de agendamiento
- `DoctorSelector.tsx`: Selector de doctor con especialidad
- `DatePicker.tsx`: Selector de fecha
- `TimeSlotSelector.tsx`: Selector de horario
- `AppointmentCard.tsx`: Tarjeta de cita individual
- `AppointmentList.tsx`: Lista de citas

#### 5.2 Para Doctores

##### 5.2.1 Dashboard de Doctor (`/doctor/dashboard/page.tsx`)
- Estadísticas (citas del día, próxima semana, etc.)
- Próximas citas del día
- Accesos rápidos

##### 5.2.2 Página de Agenda (`/doctor/appointments/page.tsx`)
- Vista de calendario con citas
- Vista de lista de citas
- Filtros por fecha y estado
- Detalles de cada cita con información del paciente

##### 5.2.3 Página de Pacientes (`/doctor/patients/page.tsx`)
- Lista de pacientes del doctor
- Información de cada paciente
- Historial de citas con cada paciente

##### 5.2.4 Página de Configuración de Horarios (`/doctor/schedule/page.tsx`)
- Configuración de horarios semanales
- Gestión de disponibilidades específicas (días libres, vacaciones)
- Vista de calendario con disponibilidad

##### 5.2.5 Componentes
- `DoctorAppointmentCard.tsx`: Tarjeta de cita para doctor
- `DoctorCalendar.tsx`: Calendario con citas
- `ScheduleEditor.tsx`: Editor de horarios
- `AvailabilityManager.tsx`: Gestor de disponibilidades
- `PatientInfoCard.tsx`: Tarjeta de información de paciente

#### 5.3 Componentes Compartidos
- `AppointmentStatusBadge.tsx`: Badge de estado de cita
- `AppointmentModal.tsx`: Modal de detalles de cita
- `ConfirmationModal.tsx`: Modal de confirmación

### 6. HOOKS PERSONALIZADOS

#### 6.1 `useAppointments.ts`
- `bookAppointment(data)`: Agendar cita
- `getMyAppointments()`: Obtener mis citas
- `cancelAppointment(id, reason)`: Cancelar cita
- `getAvailableDoctors(specialty)`: Obtener doctores disponibles
- `getAvailableSlots(doctorId, date)`: Obtener horarios disponibles

#### 6.2 `useDoctorAppointments.ts`
- `getAppointments(filters)`: Obtener citas del doctor
- `updateAppointmentStatus(id, status)`: Actualizar estado
- `addAppointmentNotes(id, notes)`: Agregar notas
- `getPatients()`: Obtener pacientes del doctor

#### 6.3 `useDoctorSchedule.ts`
- `getSchedule()`: Obtener horarios
- `updateSchedule(scheduleData)`: Actualizar horarios
- `getAvailability(startDate, endDate)`: Obtener disponibilidades
- `createAvailability(availabilityData)`: Crear disponibilidad
- `deleteAvailability(id)`: Eliminar disponibilidad

### 7. MIDDLEWARE Y VALIDACIONES

#### 7.1 Middleware de Autenticación
- Extender `requireRole` para incluir validación de doctor
- Validar que el doctor esté aprobado y activo
- Validar que el paciente tenga expediente

#### 7.2 Validaciones de Negocio
- No permitir citas en el pasado
- Verificar disponibilidad antes de crear cita
- Validar que no haya conflictos de horario
- Validar duración mínima/máxima de citas
- Validar horarios de trabajo del doctor

### 8. UTILIDADES

#### 8.1 `utils/appointmentHelpers.ts`
- `formatAppointmentDate(date)`: Formatear fecha de cita
- `calculateEndTime(startTime, duration)`: Calcular hora de fin
- `isTimeSlotAvailable(doctorId, date, time, duration)`: Verificar disponibilidad
- `getAvailableTimeSlots(doctorId, date, duration)`: Generar slots disponibles
- `validateAppointmentTime(date, time)`: Validar que no sea en el pasado

#### 8.2 `utils/scheduleHelpers.ts`
- `getDayName(dayOfWeek)`: Obtener nombre del día
- `isWithinSchedule(time, schedule)`: Verificar si está dentro del horario
- `mergeSchedulesAndAvailability(schedules, availabilities)`: Combinar horarios y disponibilidades

### 9. ACTUALIZACIONES A COMPONENTES EXISTENTES

#### 9.1 Dashboard de Paciente (`/app/dashboard/page.tsx`)
- Agregar redirección para rol 'doctor' → `/doctor/dashboard`
- Actualizar tarjeta de "Citas" para que funcione

#### 9.2 Sistema de Autenticación
- Asegurar que el login redirija correctamente según rol:
  - `admin` → `/admin`
  - `doctor` → `/doctor/dashboard`
  - `user` → `/dashboard`

### 10. ÍNDICES DE BASE DE DATOS

#### 10.1 Colección `appointments`
- Índice en `patientId`
- Índice en `doctorId`
- Índice en `appointmentDate`
- Índice compuesto en `doctorId` + `appointmentDate`
- Índice en `status`

#### 10.2 Colección `doctor_schedules`
- Índice en `doctorId`
- Índice compuesto en `doctorId` + `dayOfWeek`

#### 10.3 Colección `doctor_availabilities`
- Índice en `doctorId`
- Índice en `date`
- Índice compuesto en `doctorId` + `date`

### 11. NOTIFICACIONES (OPCIONAL - FUTURO)

#### 11.1 Emails
- Email de confirmación al agendar cita
- Email de recordatorio 24h antes
- Email de cancelación
- Email al doctor cuando se agenda una cita

### 12. TESTING Y VALIDACIÓN

#### 12.1 Casos de Prueba
- Agendar cita exitosamente
- Intentar agendar en horario no disponible
- Cancelar cita
- Verificar disponibilidad
- Configurar horarios de doctor
- Actualizar estado de cita

---

## ⚠️ REGLAS IMPORTANTES

1. **NO MODIFICAR** código existente que funcione
2. **NO CAMBIAR** la experiencia de usuario existente
3. **NO TOCAR** las colecciones existentes en MongoDB
4. Solo **AGREGAR** nuevas funcionalidades
5. Mantener **compatibilidad** con el sistema actual
6. Usar los mismos patrones y estilos del código existente
7. Seguir la estructura de carpetas actual
8. Usar TypeScript estricto
9. Validar todos los inputs
10. Manejar errores apropiadamente

---

## 📝 NOTAS DE IMPLEMENTACIÓN

- El sistema debe ser completamente independiente del sistema de asignaciones existente
- Las citas son diferentes de las asignaciones (assignments)
- Un paciente puede tener múltiples citas con diferentes doctores
- Un doctor puede tener múltiples pacientes
- Las citas tienen fecha y hora específicas
- Las asignaciones son relaciones paciente-doctor sin fecha específica
