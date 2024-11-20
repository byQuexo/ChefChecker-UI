import {CollectionNames} from "@/app/utils/stores/types";
import {apiStore} from "@/app/utils/stores/apiStore";

export async function POST(req: Request) {
    try {
        const { userId, recipeId } = await req.json();

        if (!userId || !recipeId) {
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

        if (user.favorites?.some((fav: { recipeId: string; }) => fav.recipeId === recipeId)) {
            return Response.json({
                error: "Recipe already in favorites"
            }, { status: 400 });
        }

        const result = await userCollection.updateOne(
            { id: userId },
            {
                $push: {
                    favorites: recipeId
                }
            }
        );

        if (!result.modifiedCount) {
            return Response.json({
                error: "Failed to add favorite"
            }, { status: 500 });
        }

        return Response.json({
            recipeId
        }, { status: 200 });

    } catch (e) {
        console.error("Error adding favorite:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
