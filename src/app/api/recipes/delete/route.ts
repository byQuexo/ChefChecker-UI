import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const recipeId = url.searchParams.get('recipeId');

        if (!recipeId) {
            return Response.json({
                error: "Missing recipeId parameter"
            }, { status: 400 });
        }

        const searchQuery: Filter<Document> = {
            id: recipeId
        };

        const collection = await apiStore.getCollection(CollectionNames.Recipe);
        const recipe = await collection.findOne(searchQuery);

        if (!recipe) {
            return Response.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        const deleteResult = await apiStore.deleteDocument(CollectionNames.Recipe, searchQuery);

        if (!deleteResult) {
            return Response.json({
                error: "Failed to delete recipe"
            }, { status: 500 });
        }

        if (deleteResult.deletedCount === 0) {
            return Response.json({
                error: "Recipe not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            message: "Recipe successfully deleted",
            deletedRecipeId: recipeId
        }, { status: 200 });

    } catch (e) {
        console.error("Error deleting recipe:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}