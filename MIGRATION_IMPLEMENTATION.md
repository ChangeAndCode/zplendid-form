# Implementación de Migración a MongoDB

## 📋 Resumen

Este documento describe cómo implementar la migración completa de MySQL a MongoDB Atlas.

## 🎯 Objetivo

Migrar todas las tablas MySQL a colecciones MongoDB manteniendo:
- ✅ Misma funcionalidad
- ✅ Misma API
- ✅ Sin cambios en el frontend
- ✅ Mejor rendimiento y escalabilidad

## 📦 Estructura de Colecciones MongoDB

### 1. users
```javascript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  firstName: string,
  lastName: string,
  role: 'admin' | 'user' | 'doctor',
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. patient_records
```javascript
{
  _id: ObjectId,
  patientId: string (unique, indexed),
  userId: ObjectId (reference to users),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. doctors
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to users),
  licenseNumber: string (unique, indexed),
  specialties: array | string,
  isActive: boolean,
  isApproved: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. assignments
```javascript
{
  _id: ObjectId,
  patientId: string (indexed),
  doctorId: ObjectId (reference to doctors),
  interestArea: string,
  status: 'assigned' | 'contacted' | 'completed',
  notes: string,
  assignedAt: Date,
  updatedAt: Date
}
```

### 5. form_data
```javascript
{
  _id: ObjectId,
  patientId: string (indexed),
  formType: string (indexed),
  formData: object,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. medical_records
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to users),
  patientId: string (indexed),
  recordNumber: string,
  formType: string,
  formData: object,
  isCompleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. system_settings
```javascript
{
  _id: ObjectId,
  settingKey: string (unique, indexed),
  settingValue: string,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Cambios Necesarios

### 1. Configuración
- ✅ Crear `src/lib/config/mongodb.ts` (ya creado)
- ✅ Reemplazar `getConnection()` por `getMongoConnection()`
- ✅ Actualizar variables de entorno

### 2. Modelos
- ✅ Crear modelos MongoDB equivalentes en `src/lib/models/mongodb/`
- ✅ Mantener misma interfaz pública
- ✅ Cambiar queries SQL por MongoDB queries

### 3. Servicios
- ✅ Actualizar `ChatbotDataSaver` para usar MongoDB
- ✅ Actualizar `AdminModel` para usar MongoDB
- ✅ Actualizar todos los servicios que usan MySQL

### 4. APIs
- ✅ Actualizar endpoints que usan modelos MySQL
- ✅ Mantener misma estructura de respuesta

## 📝 Pasos de Implementación

### Paso 1: Configurar MongoDB Atlas
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster (Free tier M0)
3. Crear usuario de base de datos
4. Obtener connection string
5. Configurar IP whitelist (0.0.0.0/0 para desarrollo)

### Paso 2: Variables de Entorno
```env
# Eliminar estas:
# DB_HOST=...
# DB_USER=...
# DB_PASSWORD=...
# DB_NAME=...
# DB_PORT=...

# Agregar esta:
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/zplendid?retryWrites=true&w=majority
```

### Paso 3: Crear Modelos MongoDB
Crear modelos equivalentes para:
- [x] UserModel (ejemplo creado)
- [ ] PatientRecordModel
- [ ] DoctorModel
- [ ] AssignmentModel
- [ ] PatientFormDataModel
- [ ] MedicalRecordModel
- [ ] SystemSettingsModel
- [ ] AdminModel (actualizar)

### Paso 4: Actualizar Imports
Cambiar en todos los archivos:
```typescript
// Antes
import { UserModel } from '../models/User';
import { getConnection } from '../config/database';

// Después
import { UserModelMongo as UserModel } from '../models/mongodb/UserModel.mongo';
import { getMongoConnection } from '../config/mongodb';
```

### Paso 5: Actualizar Queries

#### Ejemplo: Buscar por email
```typescript
// MySQL
const [users] = await connection.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// MongoDB
const user = await collection.findOne({ email });
```

#### Ejemplo: JOIN
```typescript
// MySQL
SELECT d.*, u.firstName, u.lastName 
FROM doctors d 
INNER JOIN users u ON d.userId = u.id

// MongoDB (usando lookup)
const doctors = await collection.aggregate([
  { $match: { isApproved: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' },
  {
    $project: {
      _id: 1,
      licenseNumber: 1,
      specialties: 1,
      firstName: '$user.firstName',
      lastName: '$user.lastName',
      email: '$user.email'
    }
  }
]).toArray();
```

## ⚡ Ventajas de MongoDB

1. **Flexibilidad**: Fácil agregar campos sin migraciones
2. **Escalabilidad**: Escala automáticamente
3. **Rendimiento**: Mejor para datos no estructurados
4. **Costo**: Free tier generoso
5. **Backups**: Automáticos en Atlas

## 🧪 Testing

Después de la migración, probar:
1. ✅ Login/Registro
2. ✅ Panel de admin
3. ✅ Crear/editar pacientes
4. ✅ Chatbot y extracción de datos
5. ✅ Generación de PDFs
6. ✅ Asignaciones

## 🚀 Deploy

1. Actualizar variables de entorno en Render
2. Deploy
3. Verificar logs
4. Probar funcionalidades críticas

## 📊 Comparación de Queries

| Operación | MySQL | MongoDB |
|-----------|-------|---------|
| INSERT | `INSERT INTO ...` | `collection.insertOne()` |
| SELECT | `SELECT * FROM ...` | `collection.find()` |
| UPDATE | `UPDATE ... SET ...` | `collection.updateOne()` |
| DELETE | `DELETE FROM ...` | `collection.deleteOne()` |
| JOIN | `INNER JOIN` | `$lookup` (aggregation) |
| COUNT | `SELECT COUNT(*)` | `collection.countDocuments()` |

## ⚠️ Notas Importantes

1. **IDs**: MongoDB usa ObjectId, pero podemos mantener compatibilidad
2. **Transacciones**: MongoDB soporta transacciones (v4.0+)
3. **Índices**: Crear índices equivalentes a los de MySQL
4. **Validación**: Usar MongoDB schema validation si es necesario

## 🎯 Siguiente Paso

¿Quieres que proceda a crear todos los modelos MongoDB y actualizar el código?
