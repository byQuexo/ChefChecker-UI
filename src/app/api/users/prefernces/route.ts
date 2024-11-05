import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames, User } from "@/app/utils/stores/types";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, bio, password, userId } = body;

        if (!userId) {
            return Response.json({ error: "Missing required userId" }, { status: 400 });
        }

        const updateData: Partial<User> = {};

        if (username !== undefined) {
            updateData.username = username;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (password !== undefined) {
            updateData.password = password; // Note: In production, password should be hashed
        }

        const collection = await apiStore.getCollection(CollectionNames.User);

        const result = await collection.updateOne(
            { id: userId },
            { $set: updateData }
        );

        if (!result.matchedCount) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        if (result.modifiedCount === 0) {
            return Response.json({ error: "No changes made to user" }, { status: 400 });
        }

        const updatedUser = await collection.findOne({ id: userId });

        if (!updatedUser) {
            return Response.json({ error: "Error retrieving updated user" }, { status: 500 });
        }

        return Response.json(
            { message: "User updated successfully" },
            { status: 200 }
        );

    } catch (e) {
        console.error("Error updating user:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}