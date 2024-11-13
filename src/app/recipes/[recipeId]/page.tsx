"use client";

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { FiEdit, FiX } from "react-icons/fi";
import { Recipe, Comment } from "../../utils/stores/types";
import { getHTTP } from "../../utils/utils";
import rootStore from "../../utils/stores/globalStore";

type RecipePageProps = {
  params: { recipeId: string };
};

const RecipePage: React.FC<RecipePageProps> = observer(({ params }) => {
  const { recipeId } = params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ field: "", value: "" });
  const [editedData, setEditedData] = useState({
    title: "",
    imageSrc: "",
    ingredients: "",
    instructions: "",
    visibility: "public",
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const isCurrentUserOwner = rootStore.userId === recipe?.userId;

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return;

      try {
        const response = await getHTTP().get(`/api/recipes/${recipeId}`);
        const data = await response.json();
        console.log(data.recipe);

        if (data.recipe) {
          setRecipe(data.recipe);
          setEditedData({
            title: data.recipe.title,
            imageSrc: data.recipe.recipeImage,
            ingredients: data.recipe.ingredients.join(", "),
            instructions: data.recipe.instructions,
            visibility: data.recipe.visibility || "public",
          });
          setComments(data.recipe.comments);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (rootStore.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [rootStore.darkMode]);

  const openModal = (field: string, value: string) => {
    setModalContent({ field, value });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64Image = await convertImageToBase64(file);
      setEditedData((prevData) => ({
        ...prevData,
        imageSrc: base64Image,
      }));
      handleUpdate("recipeImage", base64Image);
    }
  };

  const handleSave = () => {
    const updatedValue =
      modalContent.field === "ingredients"
        ? modalContent.value.split(",").map((item) => item.trim())
        : modalContent.value;

    setEditedData((prevData) => ({
      ...prevData,
      [modalContent.field]: updatedValue,
    }));
    handleUpdate(modalContent.field, updatedValue);
    setShowModal(false);
  };

  const handleUpdate = async (field: string, value: string | string[]) => {
    const updatedData = {
      recipeId,
      [field]: value,
    };

    try {
      await getHTTP().patch("/api/recipes/update", updatedData);
      console.log(`${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const commentData = {
      userId: rootStore.userId || "",
      recipeId,
      text: newComment,
    };

    try {
      const response = await getHTTP().post("/api/recipes/comments/add", commentData);
      if (response.status === 201) {
        setComments([...comments, { commentId: `${comments.length + 1}`, userId: rootStore.userId!, text: newComment }]);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleVisibility = () => {
    const newVisibility = editedData.visibility === "public" ? "private" : "public";
    setEditedData((prevData) => ({
      ...prevData,
      visibility: newVisibility,
    }));
    handleUpdate("visibility", newVisibility);
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className={`p-12 min-h-screen flex justify-center items-center ${rootStore.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`shadow-2xl rounded-xl max-w-[1200px] w-full p-6 transform transition duration-500 ${rootStore.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        <h1 className={`text-center text-3xl font-bold ${rootStore.darkMode ? 'text-yellow-400' : 'text-red-700'} mb-6 flex items-center justify-center`}>
          {editedData.title}
          {isCurrentUserOwner && (
            <button onClick={() => openModal("title", editedData.title)}>
              <FiEdit className={`ml-2 ${rootStore.darkMode ? 'text-yellow-400' : 'text-red-700'}`} />
            </button>
          )}
        </h1>

        <div className="rounded-md overflow-hidden shadow-sm mb-6 relative">
          <img src={editedData.imageSrc} alt={recipe.title} className="w-full object-cover max-h-96" />
          {isCurrentUserOwner && (
            <label className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer">
              <FiEdit className={`text-${rootStore.darkMode ? 'yellow-400' : 'red-700'}`} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
          <div className={`w-full lg:w-1/2 ${rootStore.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-yellow-100/80 border-yellow-100/70'} p-4 rounded-md shadow-md`}>
            <h2 className={`text-xl font-semibold ${rootStore.darkMode ? 'text-yellow-400' : 'text-red-800'} mb-4 flex items-center`}>
              Ingredients
              {isCurrentUserOwner && (
                <button onClick={() => openModal("ingredients", editedData.ingredients)}>
                  <FiEdit className={`ml-2 ${rootStore.darkMode ? 'text-yellow-400' : 'text-red-700'}`} />
                </button>
              )}
            </h2>
            <ul className={`text-sm list-disc list-inside space-y-2 ${rootStore.darkMode ? 'text-yellow-400' : 'text-gray-700'}`}>
              {Array.isArray(editedData.ingredients)
                ? editedData.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))
                : editedData.ingredients.split(", ").map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
          </div>

          <div className={`w-full lg:w-1/2 ${rootStore.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-yellow-100/80 border-yellow-100/70'} p-4 rounded-md shadow-md`}>
            <h2 className={`text-xl font-semibold ${rootStore.darkMode ? 'text-yellow-400' : 'text-red-800'} mb-4 flex items-center`}>
              Instructions
              {isCurrentUserOwner && (
                <button onClick={() => openModal("instructions", editedData.instructions)}>
                  <FiEdit className={`ml-2 ${rootStore.darkMode ? 'text-yellow-400' : 'text-red-700'}`} />
                </button>
              )}
            </h2>
            <ol className={`text-sm list-decimal list-inside space-y-2 ${rootStore.darkMode ? 'text-yellow-400' : 'text-gray-700'}`}>
              {editedData.instructions.split("\n").map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {isCurrentUserOwner && (
          <div className="mt-4">
            <button
              onClick={toggleVisibility}
              className={`py-2 px-4 rounded-md font-semibold ${editedData.visibility === 'public' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} hover:bg-opacity-90 transition duration-200`}
            >
              Set as {editedData.visibility === 'public' ? 'Private' : 'Public'}
            </button>
          </div>
        )}

        <div className={`${rootStore.darkMode ? 'bg-gray-700' : 'bg-yellow-100'} p-4 rounded-lg shadow-md mt-6`}>
          <h2 className={`text-xl font-semibold ${rootStore.darkMode ? 'text-yellow-400' : 'text-gray-800'} mb-4`}>Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-4 mb-4">
                <div className="text-yellow-500 text-3xl">😊</div>
                <div>
                  <p className={`text-sm font-semibold ${rootStore.darkMode ? 'text-yellow-400' : 'text-gray-800'}`}>{comment.userId}</p>
                  <p className={`text-sm ${rootStore.darkMode ? 'text-yellow-400' : 'text-gray-600'}`}>{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={`${rootStore.darkMode ? 'text-yellow-400' : 'text-gray-600'}`}>No comments yet.</p>
          )}
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className={`${rootStore.darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-purple-500 text-white'} w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-purple-500 duration-200 ease-in-out`}
            />
            <button
              onClick={handleAddComment}
              className="bg-purple-500 text-white py-2 px-6 rounded-md font-semibold mt-2 hover:bg-purple-600 transition duration-200"
            >
              Add Comment
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-yellow-400">Edit {modalContent.field.charAt(0).toUpperCase() + modalContent.field.slice(1)}</h2>
                <button onClick={closeModal}>
                  <FiX className="text-gray-800 dark:text-yellow-400 text-2xl" />
                </button>
              </div>
              <textarea
                value={modalContent.value}
                onChange={(e) => setModalContent({ ...modalContent, value: e.target.value })}
                rows={10}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-yellow-400"
                placeholder={`Edit ${modalContent.field}...`}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="bg-purple-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-purple-600 transition duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default RecipePage;
