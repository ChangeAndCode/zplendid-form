import { ObjectId } from 'mongodb';
import { getCollection } from '../config/database';

/**
 * Helper para convertir userId numérico a ObjectId de MongoDB
 * Mantiene compatibilidad con código existente que usa números
 */
export async function getUserIdAsObjectId(userId: number | string): Promise<ObjectId | null> {
  if (typeof userId === 'string' && ObjectId.isValid(userId)) {
    return new ObjectId(userId);
  }
  
  if (typeof userId === 'number') {
    const usersCollection = await getCollection('users');
    // Buscar usuario cuyo ObjectId convertido coincida con userId
    // Nota: Esto es ineficiente pero necesario para compatibilidad
    // En producción, considerar guardar un campo 'numericId' adicional
    const users = await usersCollection.find({}).toArray();
    
    for (const user of users) {
      if (user._id) {
        const numericId = parseInt(user._id.toString().slice(-8), 16);
        if (numericId === userId) {
          return user._id;
        }
      }
      if ((user as any).id === userId) {
        return user._id || null;
      }
    }
  }
  
  return null;
}
