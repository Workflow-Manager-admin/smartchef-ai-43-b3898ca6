import React, { useState } from "react";

const AIGenerator = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  const handleGenerate = async () => {
    setLoading(true);
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      setRecipes(
        "OpenAI API key is missing. Please set REACT_APP_OPENAI_API_KEY in your .env file and restart the app."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Suggest 3 recipes using these ingredients: ${ingredients}`
            }
          ]
        })
      });

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "No recipe suggestions found.";
      setRecipes(aiReply);
    } catch (err) {
      setRecipes("An error occurred while contacting the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Recipe Generator</h2>
      <input
        type="text"
        placeholder="Enter ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{ width: "80%", padding: "8px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Get Recipes"}
      </button>
      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>{recipes}</div>
    </div>
  );
};

export default AIGenerator;
