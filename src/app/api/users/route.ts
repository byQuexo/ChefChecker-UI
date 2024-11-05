import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return Response.json({ error: "Missing userId parameter" }, { status: 400 });
        }

        const searchQuery: Filter<Document> = {
            id: userId
        };

        const collection = await apiStore.getCollection(CollectionNames.User);
        const user = await collection.findOne(searchQuery);

        if (!user) {
            return Response.json({
                error: "User not found"
            }, { status: 404 });
        }

        const sanitizedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            favorites: user.favorites,
            preference: user.preference,
            bio: user.bio
        };

        return Response.json({
            user: sanitizedUser
        }, { status: 200 });

    } catch (e) {
        console.error("Error fetching user:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}