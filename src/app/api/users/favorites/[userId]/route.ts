import {CollectionNames} from "@/app/utils/stores/types";
import {apiStore} from "@/app/utils/stores/apiStore";

export async function GET(req: Request,
                          { params }: { params: { userId: string } }
    ) {
    try {
        const userId = params.userId;

        if (!userId) {
            return Response.json({
                error: "Missing userId parameter"
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
        const favoriteRecipeIds = user.favorites || [];

        const recipes = await recipeCollection
            .find({ id: { $in: favoriteRecipeIds } })
            .toArray();

        const favoriteRecipes = recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            recipeImage: recipe.recipeImage,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            category: recipe.category,
            visibility: recipe.visibility,
            userId: recipe.userId
        }));

        return Response.json({
            recipes: favoriteRecipes,
            totalFavorites: favoriteRecipes.length
        }, { status: 200 });

    } catch (e) {
        console.error("Error fetching favorites:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}