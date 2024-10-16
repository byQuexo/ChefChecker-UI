import MongoDBClient from "@/app/utils/clients/mongodb";

export default class Store {
    public mongoDBClient: MongoDBClient

    constructor() {
        this.mongoDBClient = new MongoDBClient(); // Instantiate MongoDBClient
    }

    get MongoDBClient() {
        return this.mongoDBClient;
    }
}
