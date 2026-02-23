# The Recipe Box - Vue 3 Recipe Management Frontend

A fully functional Vue 3 frontend for managing recipes with a FastAPI backend. Features include fetching, adding, searching, editing, and deleting recipes.

## 🎯 Features

- **View All Recipes**: Display all recipes from the backend in a grid layout
- **Add New Recipe**: Add recipes by URL (backend fetches and parses)
- **Search Recipes**: Search by title or ingredient with optional max cooking time filter
- **Recipe Details**: View full recipe information including ingredients, instructions, and times
- **Edit Recipes**: Update recipe information (title, times, ingredients, instructions, dietary restrictions)
- **Delete Recipes**: Remove recipes from your collection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during API requests
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

- **Vue 3**: Latest Vue framework with Composition API
- **Vue Router**: Client-side routing for multiple pages
- **Axios**: HTTP client for API requests
- **Vite**: Fast build tool and dev server
- **Responsive CSS**: Mobile-first design

## 📁 Project Structure

```
recipe-site/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── RecipeCard.vue       # Individual recipe card
│   │   ├── RecipeList.vue       # List of recipe cards
│   │   ├── RecipeForm.vue       # Add/edit recipe form
│   │   └── SearchBar.vue        # Search interface
│   ├── pages/               # Page components
│   │   ├── Home.vue             # List all recipes
│   │   ├── AddRecipe.vue        # Add recipe page
│   │   ├── RecipeDetail.vue     # Recipe detail & edit
│   │   └── Search.vue           # Search page
│   ├── services/
│   │   └── recipeApi.js         # API service layer
│   ├── router/
│   │   └── index.js             # Vue Router configuration
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Vercel CLI: `npm i -g vercel`
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   cd recipe-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   vercel dev
   ```

4. **Open in browser:**
   The app will be available at `http://localhost:3000`

### Environment Variables

For local development, create a `.vercel/.env.development.local` file:
```
VITE_API_BASE_URL=your_api_url_here
VITE_API_KEY=your_api_key_here
```

The API key is kept secure on the server (BFF layer) and never exposed to the frontend.

## 📱 Pages & Features

### Home Page (`/`)
- Display grid of all recipes fetched from backend
- Uses `GET /recipes` endpoint
- Quick links to Add and Search pages

### Add Recipe (`/add`)
- Simple form to submit recipe URL
- Backend automatically scrapes and parses the recipe
- Uses `POST /recipes` endpoint
- Redirects to home on success

### Recipe Detail (`/recipe/:id`)
- Full recipe information display
- Ingredients list
- Numbered instructions
- Prep, cook, and total times
- Dietary restrictions badges
- Link to original recipe URL
- Edit and Delete buttons
- Uses `GET /recipes/{id}` endpoint

### Edit Recipe (Modal on Recipe Detail)
- Editable form fields for:
  - Title
  - Prep time
  - Cook time
  - Ingredients (one per line)
  - Instructions (one per line)
  - Dietary restrictions (comma-separated)
- Uses `PATCH /recipes/{id}` endpoint

### Delete Recipe
- Confirmation dialog before deletion
- Uses `DELETE /recipes/{id}` endpoint
- Redirects to home on success

### Search Page (`/search`)
- Search by title or ingredient
- Optional filter by maximum total cooking time
- Uses `GET /recipes/search?q={query}&max_time={minutes}` endpoint

## 🔗 API Integration

All API calls are handled through the `src/services/recipeApi.js` service:

```javascript
// Fetch all recipes
GET /recipes

// Fetch single recipe
GET /recipes/{id}

// Add new recipe by URL
POST /recipes
Body: { "url": "https://example.com/recipe" }

// Update recipe (any fields)
PATCH /recipes/{id}
Body: { "title": "...", "prep_time": 10, ... }

// Delete recipe
DELETE /recipes/{id}

// Search recipes
GET /recipes/search?q={query}&max_time={minutes}
```

## 🎨 UI Components

### RecipeCard
Displays recipe preview with:
- Title
- Prep, cook, and total times
- Dietary restrictions
- First 3 ingredients preview
- Link to full details

### RecipeList
Grid container for recipe cards with:
- Loading state
- Error handling
- Empty state

### RecipeForm
Dual-purpose form:
- **Add mode**: URL input only
- **Edit mode**: All recipe fields editable

### SearchBar
Search interface with:
- Query input field
- Optional max time filter
- Submit button

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` directory.

### Preview Production Build Locally
```bash
npm run preview
```

## 🚀 Deploying to Vercel

### Method 1: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from project directory:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Link to Vercel account
   - Confirm project settings
   - Deploy

### Method 2: Using Vercel Dashboard

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/recipe-site.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

### Vercel Configuration

Vite projects work automatically on Vercel. The `vite.config.js` is auto-detected.

No additional `vercel.json` needed for basic deployment. Your app will be available at:
```
https://your-project-name.vercel.app
```

## ⚙️ Configuration

### Backend URL

### Configuration

The app uses environment variables managed through `.vercel/.env.development.local`:

```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_KEY=your_api_key_here
```

**For production on Vercel**, set these in your project's Environment Variables:
1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Add `VITE_API_BASE_URL` and `VITE_API_KEY`
3. Redeploy

## 🏗️ Architecture

### Backend-For-Frontend (BFF) Pattern

The frontend uses Vercel serverless functions as a BFF layer to keep API authentication secure:

- **Frontend** (Vue 3) → `/api/*` requests
- **BFF** (Vercel serverless functions) → Adds authentication headers → External API
- **API Key** stays server-side only (never exposed to browser)

This keeps sensitive credentials secure while maintaining a clean separation of concerns.

## 🐛 Troubleshooting

### Endpoints Return 401/403
- Verify API key is set correctly in `.vercel/.env.development.local`
- Check that the key matches what's configured on your FastAPI backend
- For production, ensure environment variables are set in Vercel project settings

### Port Already in Use
If port 3000 is busy, Vercel will use the next available port:
```bash
vercel dev
```
Check the console output for the actual URL.

### Dependencies Issues
Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- Recipe URLs are scraped and parsed by the backend
- Editing is done directly in the modal on the recipe detail page
- All times are in minutes
- Dietary restrictions can be any string (e.g., "vegetarian", "vegan", "gluten-free")
- Search is case-insensitive and searches across titles and ingredients

## 🎓 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Guide](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

---

**Built with Vue 3 and FastAPI**
