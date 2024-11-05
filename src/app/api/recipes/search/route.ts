import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

const MAX_PAGE_SIZE = 10;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { searchTerms, opts } = body;


        /*
        Removed the required field for now
            if (!opts) {
                return Response.json({ error: "Missing required fields" }, { status: 400 });
            }
         */

        const page = opts.page || 1;
        const skip = (page - 1) * MAX_PAGE_SIZE;

        const searchQuery: Filter<Document> = {};

        if (searchTerms && searchTerms.trim()) {
            searchQuery.$or = [
                { title: { $regex: searchTerms, $options: 'i' } },
            ];
        }

        if (opts.category) {
            searchQuery.category = opts.category;
        }

        if (opts.visibility) {
            searchQuery.visibility = opts.visibility;
        }

        if (opts.userId) {
            searchQuery.userId = opts.userId;
        }

        const countCursor = await apiStore.search(CollectionNames.Recipe, searchQuery);
        const totalCount = countCursor ? await countCursor.count() : 0;

        const recipeCursor = await apiStore.search(CollectionNames.Recipe, searchQuery);

        if (!recipeCursor) {
            return Response.json({ error: "Database error" }, { status: 500 });
        }

        const recipes = await recipeCursor
            .sort({ title: 1 })
            .skip(skip)
            .limit(MAX_PAGE_SIZE)
            .toArray();

        if (recipes.length === 0) {
            return Response.json({
                error: "No recipes found matching your criteria"
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
        console.error("Error searching recipes:", e);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}