export type User = {
    id: string;
    email: string;
    username: string;
    password: string;
    bio?: string,
    favorites: [];
    profileImage: string,
    preference: {
        darkMode: "light" | "dark";
        units: "metric" | "imperial";
    };
};

export type Recipe = {
    id: string,
    title: string,
    ingredients: [string],
    recipeImage: string,
    instructions: string,
    category: string,
    userId: string,
    visibility: string,
    comments: []
}

export type Comment = {
    commentId: string,
    userId: string,
    text: string
}

export enum CollectionNames {
    User = "User",
    Recipe = "Recipes",
    JWT = "JWT",
}

export interface RegisterResponse{
    user: User;
}

export interface LoginResponse{
    user: User;
}

export interface PaginationData {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecipes: number;
}

export interface FilterOptions {
    page?: number;
    userId?: string | null;
    visibility?: 'public' | 'private';
    category?: string;
    favorites?: boolean;
}

export interface RecipeData {
    recipes: Recipe[];
    pagination: PaginationData;
    favorites?: boolean;
}