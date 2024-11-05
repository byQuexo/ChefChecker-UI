import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

const MAX_PAGE_SIZE = 10;

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');

        const searchQuery: Filter<Document> = {
            visibility: "public"
        };

        const countCursor = await apiStore.search(CollectionNames.Recipe, searchQuery);
        const totalCount = countCursor ? await countCursor.count() : 0;

        const recipeCursor = await apiStore.search(CollectionNames.Recipe, searchQuery);

        if (!recipeCursor) {
            return Response.json({ error: "Database error" }, { status: 500 });
        }

        const recipes = await recipeCursor
            .sort({ title: 1 }) // Sort alphabetically by title
            .skip((page - 1) * MAX_PAGE_SIZE)
            .limit(MAX_PAGE_SIZE)
            .toArray();

        if (recipes.length === 0) {
            return Response.json({
                error: "No public recipes found"
            }, { status: 404 });
        }

        const foundRecipes = recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            category: recipe.category,
            visibility: recipe.visibility,
            userId: recipe.userId
        }));

        return Response.json({
            recipes: foundRecipes,
            pagination: {
                currentPage: page,
                pageSize: MAX_PAGE_SIZE,
                totalPages: Math.ceil(totalCount / MAX_PAGE_SIZE),
                totalRecipes: totalCount
            }
        }, { status: 200 });

    } catch (e) {
        console.error("Error fetching public recipes:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}