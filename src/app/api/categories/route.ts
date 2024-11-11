import { apiStore } from "@/app/utils/stores/apiStore";
import { CollectionNames } from "@/app/utils/stores/types";

export async function GET(req: Request) {
    try {
        const collection = await apiStore.getCollection(CollectionNames.Recipe);

        const categories = await collection.distinct('category', {
            visibility: 'public'
        });

        const validCategories = categories
            .filter(category => category && category.trim())
            .sort((a, b) => a.localeCompare(b));

        const categoryCounts = await Promise.all(
            validCategories.map(async (category) => {
                const count = await collection.countDocuments({
                    category,
                    visibility: 'public'
                });

                return {
                    name: category,
                    recipeCount: count
                };
            })
        );

        return Response.json({
            categories: categoryCounts,
            totalCategories: validCategories.length
        }, { status: 200 });

    } catch (e) {
        console.error("Error fetching categories:", e);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
