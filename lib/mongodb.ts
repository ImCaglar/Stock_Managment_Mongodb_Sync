import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing!');
  console.error('📝 Please add your MongoDB connection string to .env.local file');
  console.error('🔗 Get your connection string from: https://cloud.mongodb.com');
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;

// Validate URI format and check for placeholders
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  console.error('❌ Invalid MongoDB URI format!');
  console.error('✅ URI should start with: mongodb:// or mongodb+srv://');
  throw new Error('Invalid MongoDB URI format');
}

// Check for placeholder values
if (uri.includes('<') || uri.includes('>') || uri.includes('your_') || uri.includes('password_here')) {
  console.error('❌ MongoDB URI contains placeholder values!');
  console.error('🔧 Please replace placeholders with real values:');
  console.error('   - <password> → your real MongoDB Atlas password');
  console.error('   - <username> → your real MongoDB Atlas username');
  console.error('📋 Get real connection string from MongoDB Atlas dashboard');
  throw new Error('MongoDB URI contains placeholder values');
}

const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
  maxConnecting: 2, // Limit to 2 concurrent connections
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .then((client) => {
        console.log('✅ MongoDB connected successfully!');
        return client;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('authentication failed')) {
          console.error('🔑 Authentication Error Solutions:');
          console.error('1. Check your username and password in the connection string');
          console.error('2. Ensure your user has proper database permissions');
          console.error('3. Verify your MongoDB Atlas user is active');
        }
        
        if (error.message.includes('getaddrinfo ENOTFOUND')) {
          console.error('🌐 Network Error Solutions:');
          console.error('1. Check your internet connection');
          console.error('2. Verify the cluster URL in connection string');
          console.error('3. Ensure your IP is whitelisted in MongoDB Atlas');
        }
        
        throw error;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then((client) => {
      console.log('✅ MongoDB connected successfully in production!');
      return client;
    })
    .catch((error) => {
      console.error('❌ MongoDB production connection failed:', error.message);
      throw error;
    });
}

export default clientPromise; 