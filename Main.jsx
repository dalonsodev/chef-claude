import React, { useRef, useEffect } from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromMistral, getMockRecipe } from "./ai"

export default function Main() {
   const [ingredients, setIngredients] = React.useState([])
   const [recipe, setRecipe] = React.useState("")
   const recipeRef = useRef(null)

   async function getRecipe() {
      const recipeMarkdown = await getRecipeFromMistral(ingredients)
      setRecipe(recipeMarkdown)
   }

   useEffect(() => {
      if (recipe && recipeRef.current) {
         setTimeout(() => {
            recipeRef.current.scrollIntoView({
               behavior: "smooth",
               block: "start"
            })
         }, 100)
      }
   }, [recipe])

   function handleSubmit(e) {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      addIngredient(formData)
      e.currentTarget.reset()
   }

   function addIngredient(formData) {
      const newIngredient = formData.get("ingredient")
      setIngredients(prevIngredients => [...prevIngredients, newIngredient])
   }

   return (
      <main>
         <form onSubmit={handleSubmit} className="add-ingredient-form">
            <input
               type="text"
               placeholder="e.g. oregano"
               aria-label="Add ingredient"
               name="ingredient"
            />
            <button>Add ingredient</button>
         </form>

         {ingredients.length > 0 &&
            <IngredientsList
               ingredients={ingredients}
               getRecipe={getRecipe}
            />
         }
         <div ref={recipeRef}>
            {recipe && <ClaudeRecipe recipe={recipe} />}
         </div>
      </main>
   )
}