import 'server-only';

import mongoose from 'mongoose';

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

// Keep the connection promise across Next.js development hot reloads.
const cached =
  globalWithMongoose.mongooseCache ??
  (globalWithMongoose.mongooseCache = { connection: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.connection) {
    return cached.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  cached.promise ??= mongoose.connect(uri);

  try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch (error) {
    // Allow a future request to retry after a failed connection attempt.
    cached.promise = null;
    throw error;
  }
}
