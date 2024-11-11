import {apiStore} from "@/app/utils/stores/apiStore";
import {CollectionNames} from "@/app/utils/stores/types";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, commentId, recipeId } = body;

        if (!recipeId || !userId || !commentId) {
            return Response.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        const userCollection = await apiStore.getCollection(CollectionNames.User);
        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return Response.json({
                error: "User not found"
            }, { status: 404 });
        }

        const recipeCollection = await apiStore.getCollection(CollectionNames.Recipe);
        const recipe = await recipeCollection.findOne({ id: recipeId });

        if (!recipe) {
            return Response.json({
                error: "Recipe not found"
            }, { status: 404 });
        }

        if (recipe.visibility === 'private' && recipe.userId !== userId) {
            return Response.json({
                error: "Cannot favorite private recipes from other users"
            }, { status: 403 });
        }

        const updateRecipe = recipeCollection.updateOne(
            {id: recipeId},
            {
                $pull: {
                    comments: { commentId: commentId } as never
                }
            })

        if (!updateRecipe) {
            return Response.json({
                error: "Failed to add Comment to recipe"
            }, { status: 404 });
        }

        return Response.json({
            message: "Comment deleted",
        }, { status: 200 });

    } catch (e) {
        console.error("Error adding comment:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
