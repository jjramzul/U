import React, { useState } from "react";

export default function RecipeList({ recipes, onDelete, onUpdate }) {
  if (!recipes.length) return <p>No hay recetas aún.</p>;
  return (
    <div className="grid">
      {recipes.map(r => (
        <RecipeItem key={r.id} r={r} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

function RecipeItem({ r, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(r.name);
  const [description, setDescription] = useState(r.description || "");
  const [ingredients, setIngredients] = useState(r.ingredients.join(", "));
  const [mood, setMood] = useState(r.mood ?? 3);

  const save = async () => {
    await onUpdate(r.id, {
      name: name.trim(),
      description: description.trim(),
      ingredients: ingredients.split(",").map(s => s.trim()).filter(Boolean),
      mood: Number(mood) || 3
    });
    setEditing(false);
  };

  return (
    <div className="card">
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <input value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
          <input
            type="number"
            min="1" max="5"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <div className="row">
            <button onClick={save}>Guardar</button>
            <button className="secondary" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3>{r.name}</h3>
          {r.description && <p>{r.description}</p>}
          {r.ingredients?.length > 0 && (
            <ul>
              {r.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          )}
          <p><strong>Mood:</strong> {r.mood ?? 3}</p>
          <div className="row">
            <button onClick={() => setEditing(true)}>Editar</button>
            <button className="danger" onClick={() => onDelete(r.id)}>Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
}
