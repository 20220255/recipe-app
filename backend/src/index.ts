import express from 'express'
import cors from 'cors'
import recipeApi from './recipe-api'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const app = express()
const prismaClient = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/api/recipes/search', async(req, res) => {
    // GET http://localhost/api/recipes/search?searchTerm=burgers&page=1
    const searchTerm = req.query.searchTerm as string
    const page = parseInt(req.query.page as string)
    const results = await recipeApi.searchRecipes(searchTerm, page)
    return res.json(results)
})

app.get('/api/recipes/:recipeId/summary', async(req, res) => {
    const recipeId = req.params.recipeId
    const results = await recipeApi.getRecipeSummary(recipeId)
    return res.json(results)
})

app.post('/api/recipes/favourites', async(req, res) => {
    const { recipeId } = req.body
    try {
        const favouriteRecipe = await prismaClient.favouriteRecipes.create({
            data: {recipeId}
        })
        return res.status(201).json(favouriteRecipe)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Oops,, something went wrong' })
    }
    
})

// retrieve all favourites recipe id from posgresql
app.get('/api/recipes/favourites', async(req, res) => {
    try {
        const recipes = await prismaClient.favouriteRecipes.findMany()
        const recipeIds = recipes.map((recipe) => recipe.recipeId.toString())
        const favourites = await recipeApi.getFavouriteRecipesByIds(recipeIds)
        const jsonFavourites = res.json(favourites)
        return jsonFavourites
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unable to retrieve your favorite recipes' })
    }
})

app.delete('/api/recipes/favourites', async (req, res) => {
    const { recipeId } = req.body
    try {
        const recipe = await prismaClient.favouriteRecipes.delete({ 
            where: { 
                recipeId: recipeId 
            } 
        })
        // res.send(`Recipe ${recipeId} was deleted successfully`)
        return res.status(200).send()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Deleting your favourite recipe was unsuccessful' })
    }
})

app.listen(5000, () => {
    console.log('server running on localhost 5000')
})


