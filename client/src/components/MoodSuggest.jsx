import React, { useState } from "react";
import { suggestRecipe } from "../api";

export default function MoodSuggest() {
  const [mood, setMood] = useState(3);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState("");

  const go = async () => {
    setError(""); setSuggestion(null);
    try {
      const rec = await suggestRecipe(mood);
      setSuggestion(rec);
    } catch {
      setError("No se pudo obtener sugerencia.");
    }
  };

  return (
    <div className="card">
      <h2>Sugerencia por estado de ánimo</h2>
      <label>Tu mood (1–5)</label>
      <input
        type="number"
        min="1" max="5"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />
      <button onClick={go}>Sugerir receta</button>
      {error && <p>{error}</p>}
      {suggestion && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Recomendación:</strong> {suggestion.name}</p>
          {suggestion.description && <p>{suggestion.description}</p>}
          {suggestion.ingredients?.length > 0 && (
            <ul>
              {suggestion.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          )}
          <p><em>Mood objetivo:</em> {suggestion.mood ?? 3}</p>
        </div>
      )}
    </div>
  );
}
