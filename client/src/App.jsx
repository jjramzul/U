import React, { useEffect, useState } from "react";
import { getRecipes, createRecipe, deleteRecipe, updateRecipe } from "./api";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import MoodSuggest from "./components/MoodSuggest";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getRecipes();
    setRecipes(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    const created = await createRecipe(payload);
    setRecipes(prev => [created, ...prev]);
  };

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdate = async (id, patch) => {
    const updated = await updateRecipe(id, patch);
    setRecipes(prev => prev.map(r => r.id === id ? updated : r));
  };

  return (
    <div className="container">
      <h1>📖 App de Recetas</h1>
      <RecipeForm onCreate={handleCreate} />
      <MoodSuggest />
      {loading ? <p>Cargando...</p> : (
        <RecipeList recipes={recipes} onDelete={handleDelete} onUpdate={handleUpdate} />
      )}
      <footer>API en <code>/api</code> — React + Express + JSON</footer>
    </div>
  );
}
