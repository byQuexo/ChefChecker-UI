import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { recipeId, title, ingredients, instructions, category, visibility } = body;

        if (!recipeId) {
            return Response.json({
                error: "Missing recipeId parameter"
            }, { status: 400 });
        }

        const searchQuery: Filter<Document> = {
            id: recipeId
        };

        const updateData: Partial<Document> = {};

        if (title !== undefined) updateData.title = title;
        if (ingredients !== undefined) updateData.ingredients = ingredients;
        if (instructions !== undefined) updateData.instructions = instructions;
        if (category !== undefined) updateData.category = category;
        if (visibility !== undefined) updateData.visibility = visibility;

        if (Object.keys(updateData).length === 0) {
            return Response.json({
                error: "No update data provided"
            }, { status: 400 });
        }

        const collection = await apiStore.getCollection(CollectionNames.Recipe);

        const existingRecipe = await collection.findOne(searchQuery);

        if (!existingRecipe) {
            return Response.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        const updateResult = await collection.updateOne(
            searchQuery,
            { $set: updateData }
        );

        if (!updateResult.matchedCount) {
            return Response.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                error: "No changes made to recipe"
            }, { status: 400 });
        }

        const updatedRecipe = await collection.findOne(searchQuery);

        return Response.json({
            recipe: {
                id: updatedRecipe?.id,
                title: updatedRecipe?.title,
                ingredients: updatedRecipe?.ingredients,
                instructions: updatedRecipe?.instructions,
                category: updatedRecipe?.category,
                visibility: updatedRecipe?.visibility,
                userId: updatedRecipe?.userId
            }
        }, { status: 200 });

    } catch (e) {
        console.error("Error updating recipe:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}