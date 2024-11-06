import {apiStore} from "@/app/utils/stores/apiStore";
import {CollectionNames, Recipe} from "@/app/utils/stores/types";
import {nanoid} from "nanoid";
import {InsertOneResult} from "mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, ingredients, instructions, category, visibility, userId } = body

        if (!title || !ingredients || !instructions || !category || !visibility || !userId) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const recipe: Recipe = {
            id: nanoid(32),
            title,
            ingredients,
            instructions,
            category,
            userId,
            visibility
        }

        const checkIfUserExists = await apiStore.search(CollectionNames.User, {
            id: userId
        });

        if (!checkIfUserExists) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const result = await apiStore.insertDocument(CollectionNames.Recipe, recipe) as InsertOneResult;

        if (result && result.acknowledged) {

            const createdRecipe: Recipe = {
                id: recipe.id,
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                category: recipe.category,
                visibility: recipe.visibility,
                userId: recipe.userId
            }

            return Response.json({recipe: createdRecipe}, {status: 201});
        } else {
            return Response.json({ error: "Failed to create user" }, { status: 500 });
        }
    } catch (e) {
        console.error("Error creating user:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}