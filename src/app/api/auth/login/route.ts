import {apiStore} from "@/app/utils/stores/apiStore";
import {CollectionNames} from "@/app/utils/stores/types";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const cursor = await apiStore.search(CollectionNames.User, {
            email: email,
            password: password
        });

        if (!cursor) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const users = await cursor.toArray();

        if (users.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const user = users[0];

        const returnedUser = {
            id: user.id,
            email: user.email,
            profileImage: user.profileImage,
            username: user.username,
            password: user.password,
            favorites: user.favorites,
            preference: user.preference
        }

        return Response.json({ user: returnedUser }, { status: 200 });
    } catch (e) {
        console.error("Error creating user:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}