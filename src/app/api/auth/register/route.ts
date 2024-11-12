import {CollectionNames, User} from "@/app/utils/stores/types";
import {apiStore} from "@/app/utils/stores/apiStore";
import {nanoid} from "nanoid";
import {InsertOneResult} from "mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = body;

        if (!email || !username || !password) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user: User = {
            id: nanoid(16),
            email,
            username,
            password,
            bio: "",
            favorites: [],
            profileImage: "",
            preference: {
                darkMode: "light",
                units: "metric"
            }
        };

        const result = await apiStore.insertDocument(CollectionNames.User, user) as InsertOneResult;

        if (result && result.acknowledged) {
            const createdUser = {
                id: user.id,
                email: user.email,
                username: user.username,
                password: user.password,
                favorites: user.favorites,
                preference: user.preference
            };

            return Response.json({ user: createdUser }, { status: 201 });
        } else {
            return Response.json({ error: "Failed to create user" }, { status: 500 });
        }
    } catch (e) {
        console.error("Error creating user:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
