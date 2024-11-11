import {apiStore} from "@/app/utils/stores/apiStore";
import {CollectionNames, Comment} from "@/app/utils/stores/types";
import {nanoid} from "nanoid";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, text, recipeId } = body;

        if (!recipeId || !userId || !text?.trim()) {
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

        const newComment: Comment = {
            commentId: nanoid(),
            userId,
            text
        };


        if (recipe.visibility === 'private' && recipe.userId !== userId) {
            return Response.json({
                error: "Cannot favorite private recipes from other users"
            }, { status: 403 });
        }

        const updateRecipe = recipeCollection.updateOne(
            {id: recipeId},
            {
                $push: {
                    comments: newComment as never
                }
            })

        if (!updateRecipe) {
            return Response.json({
                error: "Failed to add Comment to recipe"
            }, { status: 404 });
        }

        return Response.json({
            message: "Comment added successfully",
            comment: newComment
        }, { status: 201 });

    } catch (e) {
        console.error("Error adding comment:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
