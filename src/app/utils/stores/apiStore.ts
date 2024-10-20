import MongoDBClient from "@/app/utils/clients/mongodb";
import { Collection, Db, Document, OptionalId, InsertOneResult } from "mongodb";

class ApiStore {
    private database: Db | null = null;
    private readonly dbName = "ChefChecker";
    private readonly collectionName = "User";

    private async getDatabase(): Promise<Db> {
        if (!this.database) {
            const client = MongoDBClient.getInstance();
            await client.connect();
            this.database = await client.getDB(this.dbName);
        }
        return this.database;
    }

    private async getCollection(): Promise<Collection> {
        const db = await this.getDatabase();
        return db.collection(this.collectionName);
    }

    async insertDocument(data: OptionalId<Document>): Promise<InsertOneResult | null> {
        try {
            const collection = await this.getCollection();
            return await collection.insertOne(data);
        } catch (error) {
            console.error("Error inserting document:", error);
            return null;
        }
    }

    async close(): Promise<void> {
        await MongoDBClient.getInstance().close();
        this.database = null;
    }
}

const apiStore = new ApiStore();

export { apiStore };