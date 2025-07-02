import EditRecipeForm from "./EditRecipeForm"

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditRecipeForm recipeId={id} />
}
