import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

export async function GET(
    req: Request,
    { params }: { params: { recipeId: string } }
) {
    try {
        if (!params.recipeId) {
            return Response.json({
                error: "Missing recipe ID"
            }, { status: 400 });
        }

        const searchQuery: Filter<Document> = {
            id: params.recipeId
        };

        const collection = await apiStore.getCollection(CollectionNames.Recipe);
        const recipe = await collection.findOne(searchQuery);

        if (!recipe) {
            return Response.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        const sanitizedRecipe = {
            id: recipe.id,
            title: recipe.title,
            recipeImage: recipe.recipeImage,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            category: recipe.category,
            visibility: recipe.visibility,
            userId: recipe.userId,
            comments: recipe.comments
        };

        return Response.json({
            recipe: sanitizedRecipe
        }, { status: 200 });

    } catch (e) {
        console.error("Error fetching recipe:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}