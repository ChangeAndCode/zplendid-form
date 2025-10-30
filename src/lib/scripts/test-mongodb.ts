import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function testMongoDBConnection() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is not set');
    return;
  }

  console.log('🔗 Testing MongoDB connection...');
  console.log('📍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Probar operaciones básicas
    const db = client.db('zplendid');
    const collection = db.collection('test');
    
    // Insertar documento de prueba
    const testDoc = {
      message: 'Test connection',
      timestamp: new Date()
    };
    
    const insertResult = await collection.insertOne(testDoc);
    console.log('✅ Test document inserted:', insertResult.insertedId);
    
    // Leer documento de prueba
    const findResult = await collection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Test document retrieved:', findResult);
    
    // Limpiar documento de prueba
    await collection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document cleaned up');
    
    // Probar colección de chat_sessions
    const chatCollection = db.collection('chat_sessions');
    const chatCount = await chatCollection.countDocuments();
    console.log(`✅ Chat sessions collection exists with ${chatCount} documents`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

testMongoDBConnection();
