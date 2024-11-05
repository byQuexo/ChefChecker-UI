import {apiStore} from "@/app/utils/stores/apiStore";
import {CollectionNames} from "@/app/utils/stores/types";
import {opt} from "ts-interface-checker";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { opts } = body

        if (!opts) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log(opts)

        const getFilteredRecipes = await apiStore.search(CollectionNames.Recipe, opts);

        if (!getFilteredRecipes) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const recipes = await getFilteredRecipes.toArray();

        if (recipes.length === 0) {
            return Response.json({ error: "No recipe found" }, { status: 404 });
        }

        const foundRecipes = [];

        for (const recipe of recipes) {
            foundRecipes.push({
                id: recipe.id,
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                category: recipe.category,
                visibility: recipe.visibility,
                userId: recipe.userId
            })
        }

        return Response.json({ recipes: foundRecipes }, { status: 200 });
    } catch (e) {
        console.error("Error creating user:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}