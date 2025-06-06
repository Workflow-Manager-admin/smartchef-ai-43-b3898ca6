import React, { useState } from 'react';
import './App.css';
import AIGenerator from "./AIGenerator";

// PUBLIC_INTERFACE
function Sidebar({ currentSection, setSection }) {
  /**
   * Sidebar navigation menu for main app sections.
   */
  const navItems = [
    { label: "Home", key: "home" },
    { label: "My Recipes", key: "myRecipes" },
    { label: "Profile", key: "profile" }
  ];

  return (
    <aside className="sc-sidebar">
      <div className="sc-logo">🥗 SmartChef AI</div>
      <nav>
        {navItems.map(item => (
          <button
            key={item.key}
            className={`sc-nav-btn${currentSection === item.key ? ' active' : ''}`}
            onClick={() => setSection(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// PUBLIC_INTERFACE
function IngredientInput({
  ingredients,
  setIngredients,
  onDetectImageIngredients,
  uploading,
  detectedIngredients
}) {
  /**
   * Ingredient input area: manual entry and image upload/recognition.
   */
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);

  // Simulating image recognition: after user picks file & clicks 'Detect'
  function handleImageUpload(e) {
    setFile(e.target.files[0]);
  }
  function handleDetect() {
    if (!file) return;
    onDetectImageIngredients(file);
  }
  function handleAddIngredient() {
    if (input.trim() !== '') {
      setIngredients([...ingredients, input.trim()]);
      setInput('');
    }
  }
  function handleAddDetectedIng(ing) {
    if (!ingredients.includes(ing)) setIngredients([...ingredients, ing]);
  }
  return (
    <div className="sc-input-block">
      <div className="sc-input-header">What do you have at home?</div>
      <div className="sc-input-fields">
        <input
          className="sc-input"
          type="text"
          placeholder="eg. tomato, chicken, basil..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? handleAddIngredient() : null}
        />
        <button className="sc-btn-primary" onClick={handleAddIngredient}>Add</button>
        <div className="sc-divider" />
        <input
          className="sc-file"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button className="sc-btn-accent" disabled={!file || uploading} onClick={handleDetect}>
          {uploading ? "Detecting..." : "Detect Ingredients"}
        </button>
      </div>
      <div className="sc-ing-list">
        {ingredients.map((i, idx) => (
          <span className="sc-tag" key={i + idx}>
            {i}
            <button aria-label="Remove" className="sc-del" onClick={() => setIngredients(ingredients.filter((_,ix)=>ix!==idx))}>×</button>
          </span>
        ))}
      </div>
      {(detectedIngredients?.length > 0) && (
        <div className="sc-detected-ings">
          <span className="sc-detected-title">Detected from Image:</span>
          {detectedIngredients.map((ing, idx) => (
            <span className="sc-tag sc-tag-suggested" key={ing + idx}>
              {ing}
              <button aria-label="Add" className="sc-add" onClick={() => handleAddDetectedIng(ing)}>+</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function RecipeCard({ recipe, onSave, isSaved }) {
  /**
   * Recipe card UI component.
   */
  return (
    <div className="sc-recipe-card">
      <img
        src={recipe.image || "https://source.unsplash.com/300x200/?food,meal"}
        className="sc-recipe-img"
        alt={recipe.title}
      />
      <div className="sc-recipe-content">
        <h3 className="sc-recipe-title">{recipe.title}</h3>
        <div className="sc-recipe-section">
          <strong>Ingredients:</strong>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
              <li key={ing+idx}>{ing}</li>
            ))}
          </ul>
        </div>
        <div className="sc-recipe-section">
          <strong>Steps:</strong>
          <ol>
            {recipe.steps.map((step, idx) => (
              <li key={step+idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      {onSave &&
        <button
          className={`sc-btn-save${isSaved ? " saved" : ""}`}
          onClick={() => onSave(recipe)}
        >{isSaved ? 'Saved' : 'Save'}</button>
      }
    </div>
  );
}

// PUBLIC_INTERFACE
function RecipeSuggestions({ recipes, loading, onSaveRecipe, savedRecipes }) {
  /**
   * Container for displaying recipe cards as suggestions.
   */
  if (loading) {
    return <div style={{padding:'2em'}}>Finding your recipes...</div>;
  }
  if (!recipes?.length) {
    return <div style={{padding:'2em', color: "#999"}}>No recipe suggestions yet. Add some ingredients!</div>;
  }
  return (
    <div className="sc-recipe-list">
      {recipes.map((recipe, idx) =>
        <RecipeCard
          key={recipe.title+idx}
          recipe={recipe}
          onSave={onSaveRecipe}
          isSaved={!!savedRecipes.find(r => r.title === recipe.title)}
        />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function AuthControls({ user, onLogin, onLogout }) {
  /**
   * Auth UI: minimal stub controls for login/logout.
   */
  return (
    <div className="sc-auth">
      {user ?
        <>
          <span className="sc-user">{user.name || "User"}</span>
          <button className="sc-btn-secondary" onClick={onLogout}>Logout</button>
        </>
        :
        <button className="sc-btn-secondary" onClick={onLogin}>Login / Signup</button>
      }
    </div>
  );
}

// PUBLIC_INTERFACE
function ProfilePage({ user }) {
  return (
    <div className="sc-profile">
      <h2>Profile</h2>
      <p><b>Name:</b> {user?.name || "User"}</p>
      <p><i>This is a demo profile screen. Full user management would require backend.</i></p>
    </div>
  );
}

// PUBLIC_INTERFACE
function MyRecipesPage({ recipes }) {
  return (
    <div>
      <h2>My Recipes</h2>
      <div className="sc-recipe-list">
        {recipes.length === 0 ? (
          <div style={{ color: "#999", padding:'2em'}}>No recipes saved yet.</div>
        ) : (
          recipes.map((r, idx) =>
            <RecipeCard key={r.title+idx} recipe={r} />
          )
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main SmartChef container. Handles navigation, state, and feature rendering.
   */
  // State
  const [section, setSection] = useState("home");
  const [ingredients, setIngredients] = useState([]);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const [user, setUser] = useState(null); // {name: ...}
  const [savedRecipes, setSavedRecipes] = useState([]);



  // "Authentication" demo handlers
  function handleLogin() {
    setUser({ name: "Chef Lila" });
  }
  function handleLogout() {
    setUser(null);
    setSavedRecipes([]);
  }

  // Ingredient image recognition simulation
  function handleDetectImageIngredients(file) {
    setUploading(true);
    setTimeout(() => {
      // Simulate detection with some random picks (for real: would hit backend here)
      setDetectedIngredients([
        "tomato",
        "cheese",
        "chicken",
        "basil"
      ].filter(i => !ingredients.includes(i)));
      setUploading(false);
    }, 2000); // fake 2s
  }

  // Suggest recipes based on ingredients
  function handleSuggestRecipes() {
    setLoadingRecipes(true);
    setTimeout(() => {
      // Faking some recipes
      const recipes = [
        {
          title: "Chicken Caprese Skillet",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
          ingredients: ["chicken breast", "tomato", "basil", "mozzarella", "olive oil"],
          steps: [
            "Season and sear the chicken breasts.",
            "Add sliced tomatoes and mozzarella.",
            "Drizzle olive oil and sprinkle basil.",
            "Bake until chicken is cooked through."
          ]
        },
        {
          title: "Tomato Basil Pasta",
          image: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c56?auto=format&fit=crop&w=400&q=80",
          ingredients: ["pasta", "tomato", "basil", "garlic", "olive oil"],
          steps: [
            "Cook pasta, reserve.",
            "Sauté garlic in olive oil.",
            "Add chopped tomato and basil.",
            "Toss in pasta and serve hot."
          ]
        }
      ].filter(recipe =>
        recipe.ingredients.some(i =>
          ingredients.some(ing => i.toLowerCase().includes(ing.toLowerCase()))
        )
      );
      setSuggestedRecipes(recipes);
      setLoadingRecipes(false);
    }, 1500);
  }

  function handleSaveRecipe(recipe) {
    if (!savedRecipes.find(r => r.title === recipe.title)) {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  }

  // Home page view
  function renderHome() {
    return (
      <div>
        <IngredientInput
          ingredients={ingredients}
          setIngredients={setIngredients}
          onDetectImageIngredients={handleDetectImageIngredients}
          uploading={uploading}
          detectedIngredients={detectedIngredients}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button
            className="sc-btn-primary"
            disabled={ingredients.length === 0 || loadingRecipes}
            onClick={handleSuggestRecipes}
            style={{ minWidth: 160, fontWeight: 500, fontSize: 18 }}
          >{loadingRecipes ? "Suggesting..." : "Suggest Recipes"}</button>
        </div>
        <RecipeSuggestions
          recipes={suggestedRecipes}
          loading={loadingRecipes}
          onSaveRecipe={user ? handleSaveRecipe : null}
          savedRecipes={savedRecipes}
        />
        <div style={{ marginTop: "3em", borderTop: "1px solid #ccc", paddingTop: "2em" }}>
          <h2 style={{ fontSize: "1.5em", marginBottom: "1em" }}>Ask AI to Suggest Recipes</h2>
          <AIGenerator /> {/* 👈 This adds your AI component */}
        </div>
      </div>
    );
  }

  return (
    <div className="sc-app">
      <Sidebar currentSection={section} setSection={setSection} />
      <main className="sc-main">
        <header className="sc-header">
          <div></div>
          <div className="sc-header-ct">
            <AuthControls user={user} onLogin={handleLogin} onLogout={handleLogout} />
          </div>
        </header>
        <section className="sc-content">
          {section === "home" && renderHome()}
          {section === "myRecipes" && (
            user ? <MyRecipesPage recipes={savedRecipes} /> :
              <div style={{ padding: "2em" }}>Please log in to see your saved recipes.</div>
          )}
          {section === "profile" && (
            user ? <ProfilePage user={user} /> :
              <div style={{ padding: "2em" }}>Login to view your profile.</div>
          )}
        </section>
      </main>
    </div>
  );



}



export default App;
