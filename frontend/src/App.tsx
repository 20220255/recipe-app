
import { FormEvent, useEffect, useRef, useState } from 'react'
import './App.css'
import api from './api'
import { Recipe, Tabs } from './types'
import RecipeCard from './components/RecipeCard'
import RecipeModal from './components/RecipeModal'
import { AiOutlineSearch } from 'react-icons/ai'


const App = () => {

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined)
  const [selectedTab, setSelectedTab] = useState<Tabs>('search')
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>()

  // useRef was used so the page does not have to re-render if using useState
  const pageNumber = useRef(1)

  useEffect(() => {
    const fetchFavouriteRecipes = async() => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes()
        // console.log(favouriteRecipes.results)
        // const constFaveRecip = favouriteRecipes.results.map((recipe: Recipe) => {{recipe.id, recipe.title, recipe.image, recipe.imageType}} )
        // console.log(constFaveRecip)
        setFavouriteRecipes(favouriteRecipes.results)
      } catch (error) {
        console.log(error)
      }
    }

    fetchFavouriteRecipes()
  }, [])

  const handleSearchSubmit = async(event: FormEvent) => {
    event.preventDefault()
    try {
      const apiRecipes = await api.searchRecipes(searchTerm, 1)
      setRecipes(apiRecipes.results)
      pageNumber.current = 1
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewMore = async() => {
    const nextPage = pageNumber.current + 1
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextPage
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    setSelectedRecipe(undefined)
  }

  const addFaveRecipe = async(recipe: Recipe) => {
    try {
      // backend
      await api.addFaveRecipes(recipe)
      // frontend
      setFavouriteRecipes([...favouriteRecipes as [], recipe])
    } catch (error) {
      console.log(error)
    }
  }

  const removeFaveRecipe = async(recipe: Recipe) => {
    try {
      // backend
      await api.removeFaveRecipe(recipe)
      // frontend
      setFavouriteRecipes(favouriteRecipes?.filter(rec => rec.id !== recipe.id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='app-container'>
      <div className="header">
        <img src="/pexels-chan-walrus-941869.jpg" alt="food" />
        <div className="title">Recipe App</div>
      </div>
      <div className="tabs">
        <h1
          className={selectedTab === 'search' ? 'tab-active' : undefined} 
          onClick={() => setSelectedTab('search')}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === 'favourites' ? 'tab-active' : undefined} 
          onClick={() => setSelectedTab('favourites')}>
          Favourites
        </h1>
      </div>
      {selectedTab === 'search' && (
        <div>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input 
              type="text"
              required
              placeholder='Search for a food recipe'
              id='searchTerm'
              name='searchTerm'
              value={searchTerm}
              onChange={(event) => setSearchTerm(event?.target.value)}
            />
            <button type='submit'><AiOutlineSearch size={40} /> </button>
          </form>

          <div className="recipe-grid">
            { recipes.map((recipe) => {
              const isFave = favouriteRecipes?.some((fave) => {
                return (
                  recipe.id === fave.id
                )
              })

              return (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFaveBtnClick={isFave ? removeFaveRecipe : addFaveRecipe}
                  isFavourite={isFave}
                />
              )
            }) }
          </div>
          <div className="view-more-button-center">  
            <button 
              className="view-more-button"
              onClick={handleViewMore}
            >
              View More  
            </button>
          </div>
        </div>
      )}
      {selectedTab === 'favourites' && (
        <div className='recipe-grid'>
          { Array.isArray(favouriteRecipes) ? favouriteRecipes?.map((fr) => {
            return (
              <RecipeCard 
                key={fr.id}
                recipe={fr}
                onClick={() => setSelectedRecipe(fr)}
                onFaveBtnClick={removeFaveRecipe}
                isFavourite={true}
              />
            )
          }) : null}
        </div>
      )}

      {/* Opens the recipe summary component */}
      { selectedRecipe && <RecipeModal recipeId={selectedRecipe.id} onClose={handleClose} /> }
    </div>
  )
}

export default App