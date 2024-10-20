export type User = {
    id: string;
    email: string;
    username: string;
    password: string;
    favorites: { recipeId: string; }[];
    preference: {
        darkMode: "light" | "dark";
        units: "metric" | "imperial";
    };
};

export type Recipe = {
    id: string,
    title: string,
    ingredients: [string],
    instructions: string,
    category: string,
    userId: string,
    visibility: string
}