const RecipeApp = (() => {

  // ================= STATE =================

  const recipes = [
    {
      id: 1,
      title: "Pasta",
      difficulty: "easy",
      ingredients: ["Pasta", "Salt", "Water"],
      steps: [
        "Boil water",
        "Add pasta",
        {
          text: "Cook properly",
          substeps: ["Stir occasionally", "Cook for 10 mins"]
        },
        "Drain and serve"
      ]
    },
    {
      id: 2,
      title: "Pizza",
      difficulty: "medium",
      ingredients: ["Dough", "Cheese", "Sauce"],
      steps: [
        "Prepare dough",
        {
          text: "Add toppings",
          substeps: ["Spread sauce", "Add cheese", "Add vegetables"]
        },
        "Bake for 20 mins"
      ]
    }
  ];

  let currentFilter = "all";
  let currentSort = "";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  // ================= DOM =================

  const container = document.getElementById("recipe-container");
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");
  const recipeCounter = document.getElementById("recipe-counter");

  // ================= RENDER STEPS (RECURSION) =================

  const renderSteps = (steps) => {
    return steps.map(step => {
      if (typeof step === "string") {
        return `<li>${step}</li>`;
      } else {
        return `
          <li>${step.text}
            <ul class="substep">
              ${renderSteps(step.substeps)}
            </ul>
          </li>
        `;
      }
    }).join("");
  };

  // ================= CARD =================

  const createCard = (recipe) => {
    return `
      <div class="recipe-card">
        <button class="favorite-btn ${favorites.includes(recipe.id) ? "active" : ""}" data-id="${recipe.id}">❤️</button>
        <h3>${recipe.title}</h3>
        <p>Difficulty: ${recipe.difficulty}</p>

        <button class="toggle-btn" data-type="steps">Show Steps</button>
        <div class="steps-container">
          <ul>${renderSteps(recipe.steps)}</ul>
        </div>

        <button class="toggle-btn" data-type="ingredients">Show Ingredients</button>
        <div class="ingredients-container">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  };

  // ================= FILTERS =================

  const applySearch = (list) => {
    if (!searchQuery) return list;

    return list.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some(i =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const applyFilter = (list) => {
    if (currentFilter === "all") return list;
    if (currentFilter === "favorites")
      return list.filter(r => favorites.includes(r.id));

    return list.filter(r => r.difficulty === currentFilter);
  };

  const applySort = (list) => {
    if (currentSort === "az")
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (currentSort === "za")
      return [...list].sort((a, b) => b.title.localeCompare(a.title));
    return list;
  };

  // ================= DISPLAY =================

  const updateDisplay = () => {
    let list = [...recipes];

    list = applySearch(list);
    list = applyFilter(list);
    list = applySort(list);

    recipeCounter.textContent = `Showing ${list.length} of ${recipes.length} recipes`;

    container.innerHTML = list.map(createCard).join("");
  };

  // ================= EVENTS =================

  let debounceTimer;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value;
      clearBtn.classList.toggle("hidden", !searchQuery);
      updateDisplay();
    }, 300);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearBtn.classList.add("hidden");
    updateDisplay();
  });

  document.addEventListener("click", (e) => {

    // Toggle steps / ingredients
    if (e.target.classList.contains("toggle-btn")) {
      const containerDiv = e.target.nextElementSibling;
      containerDiv.classList.toggle("visible");
      e.target.textContent =
        containerDiv.classList.contains("visible")
          ? `Hide ${e.target.dataset.type}`
          : `Show ${e.target.dataset.type}`;
    }

    // Favorite toggle
    if (e.target.classList.contains("favorite-btn")) {
      const id = Number(e.target.dataset.id);

      if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
      } else {
        favorites.push(id);
      }

      localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
      updateDisplay();
    }

    // Filter buttons
    if (e.target.dataset.filter) {
      currentFilter = e.target.dataset.filter;
      updateDisplay();
    }

    // Sort buttons
    if (e.target.dataset.sort) {
      currentSort = e.target.dataset.sort;
      updateDisplay();
    }

  });

  // ================= INIT =================

  const init = () => {
    updateDisplay();
  };

  return { init };

})();

document.addEventListener("DOMContentLoaded", RecipeApp.init);
