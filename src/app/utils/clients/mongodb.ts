import { MongoClient, ServerApiVersion, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
    serverApi: ServerApiVersion.v1,
};

class MongoDBClient {
    private static instance: MongoDBClient;
    private client: MongoClient | null = null;

    private constructor() {}

    public static getInstance(): MongoDBClient {
        if (!MongoDBClient.instance) {
            MongoDBClient.instance = new MongoDBClient();
        }
        return MongoDBClient.instance;
    }

    async connect(): Promise<void> {
        if (!this.client) {
            try {
                this.client = new MongoClient(uri, options);
                await this.client.connect();
                console.log('Connected to MongoDB');
            } catch (err) {
                console.error('Failed to connect to MongoDB', err);
                throw err;
            }
        }
    }

    async getDB(name: string): Promise<Db> {
        if (!this.client) {
            await this.connect();
        }
        return this.client!.db(name);
    }

    async close(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            console.log('MongoDB connection closed');
        }
    }
}

export default MongoDBClient;