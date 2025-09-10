// import Anthropic from "@anthropic-ai/sdk"
import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
   You are Chef Claude, an enthusiastic and knowledgeable culinary expert.
   Provide detailed, engaging recipes with helpful tips and suggestions.
   You don't need to use every ingredient they mention in your recipe. 
   The recipe can include a couple additional ingredients they didn't mention like common pantry staples like oil, salt, pepper, herbs, garlic, onions, flour, butter, eggs, or milk, but try not to include too many extra ingredients.
   
   **STYLE:**
   - Be conversational and warm
   - Share cooking tips and variations
   - Suggest ingredient substitutions
   - Explain techniques briefly
   - Use emojis sparingly if appropriate

   **CRITICAL RULE: NEVER ASK QUESTIONS OR REQUEST FEEDBACK**
   - No "Let me know if you..."
   - No "Would you like me to..."
   - No "Do you want..."
   - No "If you have any questions..."
   - No open-ended questions of any kind
   
   **ALWAYS END WITH A WARM CLOSING PHRASE** in English or internationally recognized expressions

   **APPROPRIATE CLOSING PHRASES:**
   - "Bon appétit! 🍽️"
   - "Hope you enjoy this delicious meal! 👨‍🍳"
   - "Happy cooking! 🥘"
   - "Enjoy your culinary creation! 🌟"
   - "Dig in and enjoy! 😋"
   - "Wishing you a wonderful meal! 💫"
   - "Savor every bite! ✨"

   **RECIPE FORMAT:**
   # [Creative Recipe Name] 🍳

   ## Ingredients
   - [Ingredient with quantities]
   - [Ingredient with quantities]

   ## Instructions  
   1. [Clear step with tips]
   2. [Next step with explanation]

   ## Chef's Suggestions
   - [Optional variations or substitutions]
   - [Serving suggestions]
   - [Storage tips]

   [Warm closing phrase from approved list]

   Provide complete, self-contained recipes that stand on their own without follow-up.
   Format your response in markdown to make it easier to render to a web page.
`

// 🚨👉 ALERT: Read message below! You've been warned! 👈🚨
// If you're following along on your local machine instead of
// here on Scrimba, make sure you don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.

// const anthropic = new Anthropic({
//     // Make sure you set an environment variable in Scrimba 
//     // for ANTHROPIC_API_KEY
//     apiKey: process.env.ANTHROPIC_API_KEY,
//     dangerouslyAllowBrowser: true,
// })

// export async function getRecipeFromChefClaude(ingredientsArr) {
//     const ingredientsString = ingredientsArr.join(", ")

//     const msg = await anthropic.messages.create({
//         model: "claude-3-haiku-20240307",
//         max_tokens: 1024,
//         system: SYSTEM_PROMPT,
//         messages: [
//             { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
//         ],
//     });
//     return msg.content[0].text
// }

// 🚨👉 ALERT: Remember to set your environment variable!
// VITE_GROQ_API_KEY=your_groq_api_key_here

const hf = new HfInference(import.meta.env.VITE_GROQ_API_KEY)

export async function getRecipeFromMistral(ingredientsArr) {
   const ingredientsString = ingredientsArr.join(", ")
   try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
         },
         body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
               { 
                  role: "system", 
                  content: SYSTEM_PROMPT 
               },
               { 
                  role: "user", 
                  content: `
                        I have these ingredients: ${ingredientsString}. 
                        Share your culinary expertise with tips and variations, 
                           but provide a complete recipe that doesn't require any follow-up questions or interaction.
                     ` 
               }
            ],
            max_tokens: 1024,
            temperature: 0.7
         })
      })

      if (!response.ok) {
         throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
         throw new Error("Invalid response format from Groq API")
      }

      return data.choices[0].message.content

   } catch (err) {
      console.error("Groq API error:", err.message)
      return await getMockRecipe(ingredientsArr)
   }
}

// Development testing function
export async function getMockRecipe(ingredientsArr) {
   // Simulates an API delay
   await new Promise(resolve => setTimeout(resolve, 1500));
   return `# 🥘 Recipe with ${ingredientsArr.join(", ")}\n\n## Ingredients:\n- ${ingredientsArr.join("\n- ")}\n- Salt and pepper\n- Cooking oil\n\n## Instructions:\n1. Prepare all ingredients\n2. Heat oil in a pan\n3. Cook ingredients until done\n4. Season to taste\n5. Serve immediately\n\nEnjoy your meal! 🍽️`;
}