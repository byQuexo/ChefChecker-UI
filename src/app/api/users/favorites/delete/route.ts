import {apiStore} from "@/app/utils/stores/apiStore";
import {CollectionNames} from "@/app/utils/stores/types";

export async function POST(req: Request) {
    try {
        const { userId, recipeId } = await req.json();

        if (!userId || !recipeId) {
            return Response.json({
                error: "Missing required parameters"
            }, { status: 400 });
        }

        const userCollection = await apiStore.getCollection(CollectionNames.User);

        const result = await userCollection.updateOne(
            { id: userId } ,
            {
                $pull: {
                    favorites: recipeId
                }
            }
        );

        if (!result.matchedCount) {
            return Response.json({
                error: "User not found"
            }, { status: 404 });
        }

        if (!result.modifiedCount) {
            return Response.json({
                error: "Recipe not found in favorites"
            }, { status: 404 });
        }

        return Response.json({
            message: "Removed from favorites successfully",
            recipeId
        }, { status: 200 });

    } catch (e) {
        console.error("Error removing favorite:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}