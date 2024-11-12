import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";
import { Filter, Document } from "mongodb";

const MAX_PAGE_SIZE = 8;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { searchTerms, opts = {} } = body;

        const page = opts.page || 1;
        const skip = (page - 1) * MAX_PAGE_SIZE;

        const searchQuery: Filter<Document> = {};

        if (searchTerms?.trim()) {
            searchQuery.$or = [
                { title: { $regex: searchTerms.trim(), $options: 'i' } },
            ];
        }

        if (opts.category) {
            searchQuery.category = opts.category;
        }

        if (opts.visibility === 'private') {
            if (!opts.userId) {
                return Response.json({
                    error: "User ID required to access private recipes"
                }, { status: 403 });
            }
            searchQuery.visibility = 'private';
            searchQuery.userId = opts.userId;
        } else if (opts.userId) {
            searchQuery.$or = [
                { visibility: 'public' },
                { $and: [{ visibility: 'private' }, { userId: opts.userId }] }
            ];
        } else {
            searchQuery.visibility = 'public';
        }

        const collection = await apiStore.getCollection(CollectionNames.Recipe);
        const totalCount = await collection.countDocuments(searchQuery);

        const recipeCursor = await apiStore.search(CollectionNames.Recipe, searchQuery);

        if (!recipeCursor) {
            return Response.json({
                error: "Database error"
            }, { status: 500 });
        }

        const recipes = await recipeCursor
            .sort({ title: 1 })
            .skip(skip)
            .limit(MAX_PAGE_SIZE)
            .toArray();

        if (recipes.length === 0) {
            return Response.json({
                recipes: [],
                pagination: {
                    currentPage: page,
                    pageSize: MAX_PAGE_SIZE,
                    totalPages: Math.ceil(totalCount / MAX_PAGE_SIZE),
                    totalRecipes: totalCount
                },
                message: "No recipes found matching your criteria"
            }, { status: 200 }); // Changed to 200 to provide pagination info even when empty
        }

        // Filter and sanitize recipes
        const foundRecipes = recipes.map(recipe => ({
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
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');

        const searchQuery: Filter<Document> = {
            visibility: "public"
        };

        const collection = await apiStore.getCollection(CollectionNames.Recipe);
        const totalCount = await collection.countDocuments(searchQuery);

        const recipes = await collection
            .find(searchQuery)
            .sort({ title: 1 })
            .skip((page - 1) * MAX_PAGE_SIZE)
            .limit(MAX_PAGE_SIZE)
            .toArray();

        return Response.json({
            recipes: recipes.map(recipe => ({
                id: recipe.id,
                title: recipe.title,
                recipeImage: recipe.recipeImage,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                category: recipe.category,
                visibility: recipe.visibility,
                userId: recipe.userId
            })),
            pagination: {
                currentPage: page,
                pageSize: MAX_PAGE_SIZE,
                totalPages: Math.ceil(totalCount / MAX_PAGE_SIZE),
                totalRecipes: totalCount
            }
        }, { status: 200 });

    } catch (e) {
        console.error("Error searching recipes:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}