"use client";

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Pencil, X, ArrowLeft } from "lucide-react";
import { Recipe, Comment } from "../../utils/stores/types";
import { getHTTP } from "../../utils/utils";
import rootStore from "../../utils/stores/globalStore";
import { useRouter } from "next/navigation";

type RecipePageProps = {
  params: { recipeId: string };
};

interface UserProfile {
  id: string;
  username: string;
  profileImage: string;
}

const RecipePage: React.FC<RecipePageProps> = observer(({ params }) => {
  const router = useRouter();
  const { recipeId } = params;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserProfile }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ field: "", value: "" });
  const [editedData, setEditedData] = useState({
    title: "",
    imageSrc: "",
    ingredients: [] as string[], 
    instructions: "",
    visibility: "public",
  });

  const isCurrentUserOwner = rootStore.userId === recipe?.userId;
  const darkMode = rootStore.darkMode;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getHTTP().get(`/api/recipes/${recipeId}`);
        const data = await response.json();

        if (data.recipe) {
          setRecipe(data.recipe);
          setEditedData({
            title: data.recipe.title,
            imageSrc: data.recipe.recipeImage,
            ingredients: Array.isArray(data.recipe.ingredients)
              ? data.recipe.ingredients
              : data.recipe.ingredients.split(", "),
            instructions: data.recipe.instructions,
            visibility: data.recipe.visibility || "public",
          });
          setComments(data.recipe.comments || []);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    comments?.forEach((comment) => {
      if (comment.userId && !userProfiles[comment.userId]) {
        fetchUserProfile(comment.userId);
      }
    });
  }, [comments]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await getHTTP().get(`/api/users/${userId}`);
      const userData = await response.json();

      const sanitizedUser: UserProfile = {
        id: userData.user.id,
        username: userData.user.username,
        profileImage: userData.user.profileImage,
      };

      setUserProfiles((prev) => ({ ...prev, [userId]: sanitizedUser }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const openModal = (field: string, value: string | string[]) => {
    const stringValue =
      Array.isArray(value) && field === "ingredients" ? value.join(", ") : String(value);

    setModalContent({ field, value: stringValue });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

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
    const updatedData = { recipeId, [field]: value };

    try {
      await getHTTP().patch("/api/recipes/update", updatedData);
      setRecipe((prev) => (prev ? { ...prev, [field]: value } : prev));
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
        setComments((prev) => [
          ...prev,
          { commentId: `${prev.length + 1}`, userId: rootStore.userId!, text: newComment },
        ]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const deleteData = { userId: rootStore.userId || "", commentId, recipeId };

    try {
      const response = await getHTTP().post("/api/recipes/comments/delete", deleteData);
      if (response.status === 200) {
        setComments((prev) => prev.filter((comment) => comment.commentId !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64Image = await convertImageToBase64(file);
      setEditedData((prev) => ({ ...prev, imageSrc: base64Image }));
      handleUpdate("recipeImage", base64Image);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const toggleVisibility = () => {
    const newVisibility = editedData.visibility === "public" ? "private" : "public";
    setEditedData((prev) => ({ ...prev, visibility: newVisibility }));
    handleUpdate("visibility", newVisibility);
  };

  if (!recipe) return (
    <div className={`flex justify-center items-center h-64 
        ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 
            ${darkMode ? 'border-purple-400' : 'border-purple-500'}`}></div>
    </div>
);

return (
  <div
    className={`p-12 min-h-screen ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`}
  >
    <div
      className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg relative ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >

    <div className="p-6 absolute left-2 top-2">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")} // Redirect to the home page
            className="flex items-center space-x-2 text-purple-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-5 h-5" /> {/* The back arrow icon */}
            <span>Back</span> {/* Optional text label */}
          </button>
      </div>

      <div className="relative mb-6 mt-12">
        <img
          data-testid="recipe-image"
          src={editedData.imageSrc}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
        {isCurrentUserOwner && (
          <label className="absolute top-4 right-4 bg-gray-300 dark:bg-gray-700 p-2 rounded-full cursor-pointer shadow-md">
            <Pencil className="text-gray-700 dark:text-white" />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>

      <h1
        data-testid="recipe-title"
        className={`text-4xl font-bold pb-6 text-center border-b-2 ${
          darkMode ? "border-gray-700 text-blue-200" : "border-gray-200 text-gray-800"
        }`}
      >
        {editedData.title}
        {isCurrentUserOwner && (
          <button data-testid="edit-title-button" onClick={() => openModal("title", editedData.title)} className="ml-2">
            <Pencil className="text-yellow-400" />
          </button>
        )}
      </h1>

      <div
        className={`flex justify-between items-start mt-8 mb-8 p-4 ${
          darkMode
            ? "bg-gray-700 rounded-md"
            : "bg-gray-50 border border-gray-200 shadow-sm rounded-lg"
        }`}
      >
        <div className="flex-1 pr-4">
          <h2
            className={`text-xl font-semibold mb-4 flex items-center ${
              darkMode ? "text-yellow-400" : "text-gray-800"
            }`}
          >
            Ingredients
            {isCurrentUserOwner && (
              <button data-testid="edit-ingredients-button" onClick={() => openModal("ingredients", editedData.ingredients)} className="ml-2">
                <Pencil className="text-yellow-400" />
              </button>
            )}
          </h2>
          <ul
            className={`list-disc pl-4 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {editedData.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className={`flex-1 pl-4 border-l-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h2
            className={`text-xl font-semibold mb-4 flex items-center ${
              darkMode ? "text-yellow-400" : "text-gray-800"
            }`}
          >
            Instructions
            {isCurrentUserOwner && (
              <button data-testid="edit-instructions-button" onClick={() => openModal("instructions", editedData.instructions)} className="ml-2">
                <Pencil className="text-yellow-400" />
              </button>
            )}
          </h2>
          <ol
            className={`list-decimal pl-4 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {editedData.instructions.split("\n").map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div
        data-testid="comments-section"
        className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-700" : "bg-gray-50 border border-gray-200 shadow-sm"
        } mb-8`}
      >
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.map((comment) => {
          const user = userProfiles[comment.userId];
          return (
            <div
              key={comment.commentId}
              className={`flex items-start mb-4`}
            >
              {user ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-4 shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-400 mr-4" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-purple-300" : "text-gray-800"
                  }`}
                >
                  {user ? user.username : "Unknown User"}
                </p>
                <p>{comment.text}</p>
              </div>
              {comment.userId === rootStore.userId && (
                <button id="deleteComment" onClick={() => handleDeleteComment(comment.commentId)} className="ml-auto text-red-500">
                  <X />
                </button>
              )}
            </div>
          );
        })}
        <textarea
          data-testid="add-comment-textarea"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className={`w-full p-2 mt-4 rounded-lg ${
            darkMode
              ? "bg-gray-800 text-gray-300 border-gray-600"
              : "bg-gray-100 text-gray-800 border border-gray-300"
          }`}
          placeholder="Add a comment..."
        />
        <button
          data-testid="add-comment-button"
          onClick={handleAddComment}
          className="bg-purple-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-purple-600 transition"
        >
          Add Comment
        </button>
      </div>

     {isCurrentUserOwner && (
        <button
          onClick={toggleVisibility}
          className={`px-4 py-2 rounded-md ${
            editedData.visibility === "public" ? "bg-green-500" : "bg-red-500"
          } text-white hover:opacity-90 transition`}
        >
          {editedData.visibility === "public" ? "Set as Private" : "Set as Public"}
        </button>
      )}
    </div>

    {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      className={`w-[90%] max-w-lg p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
      }`}
    >

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Edit {modalContent.field.charAt(0).toUpperCase() + modalContent.field.slice(1)}
        </h2>
        <button onClick={closeModal}>
          <X
            className={`text-xl ${
              darkMode ? "text-gray-400 hover:text-red-400" : "text-gray-600 hover:text-red-500"
            } transition-colors duration-200`}
          />
        </button>
      </div>

      <textarea
        data-testid="edit-title-textarea"
        value={modalContent.value}
        onChange={(e) => setModalContent({ ...modalContent, value: e.target.value })}
        rows={10}
        className={`w-full p-4 rounded-md border ${
          darkMode
            ? "border-gray-600 bg-gray-700 text-gray-300 focus:ring-purple-500"
            : "border-gray-300 bg-gray-100 text-gray-800 focus:ring-blue-500"
        } focus:outline-none focus:ring-2 transition duration-200`}
        placeholder={`Edit ${modalContent.field}...`}
      />

      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={closeModal}
          className={`px-4 py-2 rounded-md ${
            darkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          } transition duration-200`}
        >
          Cancel
        </button>
        <button
          data-testid="save-button"
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition duration-200"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
  </div>

)})

export default RecipePage;
