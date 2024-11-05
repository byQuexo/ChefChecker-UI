import MongoDBClient from "@/app/utils/clients/mongodb";
import { Collection, Db, Document, OptionalId, InsertOneResult, Filter, FindCursor} from "mongodb";
import { CollectionNames } from "@/app/utils/stores/types";


class ApiStore {
    private database: Db | null = null;
    private readonly dbName = "ChefChecker";

    private async getDatabase(): Promise<Db> {
        if (!this.database) {
            const client = MongoDBClient.getInstance();
            await client.connect();
            this.database = await client.getDB(this.dbName);
        }
        return this.database;
    }

    public async getCollection(collectionName: CollectionNames): Promise<Collection> {
        const db = await this.getDatabase();
        return db.collection(collectionName);
    }

    //method for inserting one Document in MongoDB in a specific Collection
    async insertDocument(collectionName: CollectionNames, data: OptionalId<Document>): Promise<InsertOneResult | null> {
        try {
            const collection = await this.getCollection(collectionName);
            return await collection.insertOne(data);
        } catch (error) {
            console.error("Error inserting document:", error);
            return null;
        }
    }

    //generic simple method to write queries for mongoDB
    async search(collectionName: CollectionNames, query: Filter<Document>): Promise<FindCursor | null> {
        try {
            const collection = await this.getCollection(collectionName);
            return collection.find(query);
        } catch (error) {
            console.error("Error inserting document:", error);
            return null;
        }
    }

    //unused but eventually necessary
    async close(): Promise<void> {
        await MongoDBClient.getInstance().close();
        this.database = null;
    }
}

const apiStore = new ApiStore();

export { apiStore };