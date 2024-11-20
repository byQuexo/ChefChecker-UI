"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import rootStore from "../../utils/stores/globalStore";
import { getHTTP } from "../../utils/utils";

const NewRecipePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false); 

  useEffect(() => {
    const initPage = async () => {
      const isDarkMode = rootStore.darkMode;
      const userId = rootStore.userId;

      if (!userId) {
        router.push('/authentication')
      }
      setDarkMode(isDarkMode);
      setLoading(false); 
    };

    initPage();
  }, []);

  const [newRecipe, setNewRecipe] = useState({
    title: "",
    imageSrc: "",
    ingredients: "",
    instructions: "",
    category: "",
    visibility: "public",
  });

  const handleInputChange = (field: string, value: string) => {
    setNewRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64Image = await convertImageToBase64(file);
      setNewRecipe((prev) => ({ ...prev, imageSrc: base64Image }));
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    const ingredientsString = newRecipe.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item)
      .join(", ");

    const recipeData: Record<string, string> = {
      title: newRecipe.title,
      ingredients: ingredientsString,
      recipeImage: newRecipe.imageSrc,
      instructions: newRecipe.instructions,
      category: newRecipe.category || "Uncategorized",
      visibility: newRecipe.visibility,
      userId: rootStore.userId || "",
    };

    try {
      const response = await getHTTP().post("/api/recipes/create", recipeData);
      if (response.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            darkMode ? "border-purple-400" : "border-purple-500"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={`p-12 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6 absolute left-2 top-2">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-purple-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center">
          Create a New Recipe
        </h1>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Title</label>
          <input
            type="text"
            value={newRecipe.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={`w-full p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
            placeholder="Enter recipe title"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {newRecipe.imageSrc && (
            <img
              src={newRecipe.imageSrc}
              alt="Recipe Preview"
              className="mt-4 w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Ingredients (comma-separated)
          </label>
          <textarea
            value={newRecipe.ingredients}
            onChange={(e) => handleInputChange("ingredients", e.target.value)}
            className={`w-full p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
            placeholder="Enter ingredients, separated by commas"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Instructions
          </label>
          <textarea
            value={newRecipe.instructions}
            onChange={(e) => handleInputChange("instructions", e.target.value)}
            className={`w-full p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
            placeholder="Enter step-by-step instructions"
            rows={6}
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Category</label>
          <select
            value={newRecipe.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className={`w-full p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Noodles">Noodles</option>
            <option value="Pizza">Pizza</option>
            <option value="Burger">Burger</option>
            <option value="Asia">Asia</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Visibility</label>
          <select
            value={newRecipe.visibility}
            onChange={(e) => handleInputChange("visibility", e.target.value)}
            className={`w-full p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
        >
          Create Recipe
        </button>
      </div>
    </div>
  );
};

export default NewRecipePage;
