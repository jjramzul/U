const base = "/api";

export async function getRecipes() {
  const res = await fetch(`${base}/recipes`);
  return res.json();
}

export async function createRecipe(payload) {
  const res = await fetch(`${base}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error creando receta");
  return res.json();
}

export async function deleteRecipe(id) {
  const res = await fetch(`${base}/recipes/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Error eliminando receta");
}

export async function updateRecipe(id, patch) {
  const res = await fetch(`${base}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error("Error actualizando receta");
  return res.json();
}

export async function suggestRecipe(mood) {
  const res = await fetch(`${base}/recipes/suggest?mood=${mood}`);
  if (!res.ok) throw new Error("No se pudo sugerir receta");
  return res.json();
}
