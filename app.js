// Recipe Data
const recipes = [
    { title: "Pasta", difficulty: "easy", time: 20 },
    { title: "Chicken Curry", difficulty: "medium", time: 45 },
    { title: "Grilled Sandwich", difficulty: "easy", time: 15 },
    { title: "Beef Steak", difficulty: "hard", time: 60 },
    { title: "Salad", difficulty: "easy", time: 10 },
    { title: "Biryani", difficulty: "hard", time: 90 },
    { title: "Fried Rice", difficulty: "medium", time: 30 },
    { title: "Soup", difficulty: "easy", time: 25 }
];

// State Management
let currentFilter = "all";
let currentSort = "none";

// DOM Reference
const recipeContainer = document.getElementById("recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");

// Render Function
const renderRecipes = (recipesArray) => {
    recipeContainer.innerHTML = "";

    recipesArray.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <p>Difficulty: ${recipe.difficulty}</p>
            <p>Cooking Time: ${recipe.time} mins</p>
        `;

        recipeContainer.appendChild(card);
    });
};

// --------------------
// PURE FILTER FUNCTIONS
// --------------------

const filterByDifficulty = (recipes, level) => {
    return recipes.filter(recipe => recipe.difficulty === level);
};

const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time < maxTime);
};

const applyFilter = (recipes, filterType) => {
    switch (filterType) {
        case "easy":
            return filterByDifficulty(recipes, "easy");
        case "medium":
            return filterByDifficulty(recipes, "medium");
        case "hard":
            return filterByDifficulty(recipes, "hard");
        case "quick":
            return filterByTime(recipes, 30);
        default:
            return recipes;
    }
};

// --------------------
// PURE SORT FUNCTIONS
// --------------------

const sortByName = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.title.localeCompare(b.title)
    );
};

const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.time - b.time
    );
};

const applySort = (recipes, sortType) => {
    switch (sortType) {
        case "name":
            return sortByName(recipes);
        case "time":
            return sortByTime(recipes);
        default:
            return recipes;
    }
};

// --------------------
// MAIN UPDATE FUNCTION
// --------------------

const updateDisplay = () => {
    let result = recipes;

    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    renderRecipes(result);
    updateActiveButtons();
};

// --------------------
// ACTIVE BUTTON UPDATE
// --------------------

const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add("active");
        }
    });

    sortButtons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.sort === currentSort) {
            btn.classList.add("active");
        }
    });
};

// --------------------
// EVENT LISTENERS
// --------------------

filterButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        currentFilter = event.target.dataset.filter;
        updateDisplay();
    });
});

sortButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        currentSort = event.target.dataset.sort;
        updateDisplay();
    });
});

// Initialize
updateDisplay();
