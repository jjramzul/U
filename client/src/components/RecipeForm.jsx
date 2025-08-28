import React, { useState } from "react";

export default function RecipeForm({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [mood, setMood] = useState(3);

  const submit = async (e) => {
    e.preventDefault();
    const ingredients = ingredientsText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (!name.trim()) return;

    await onCreate({
      name: name.trim(),
      description: description.trim(),
      ingredients,
      mood: Number(mood) || 3
    });
    setName(""); setDescription(""); setIngredientsText(""); setMood(3);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Agregar Receta</h2>
      <label>Nombre</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Arepas de queso" />
      <label>Descripción</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paso a paso o notas breves..." />
      <label>Ingredientes (separados por coma)</label>
      <input value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} placeholder="Harina, Queso, Sal" />

      <label>Estado de ánimo (1–5)</label>
      <input
        type="number"
        min="1" max="5"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />

      <button type="submit">Guardar</button>
    </form>
  );
}
