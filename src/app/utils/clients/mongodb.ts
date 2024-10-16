import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}

class MongoDBClient {
    private client: MongoClient | null = null;

    constructor() {}

    async connect() {
        try {
            this.client = new MongoClient(uri, options);
            await this.client.connect();
        } catch (err) {
            throw err;
        }
    }

    async getDB() {
        if (!this.client) {
            throw new Error('MongoDB client is not connected');
        }
        return this.client.db();
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log('MongoDB connection closed');
        }
    }
}

export default MongoDBClient;