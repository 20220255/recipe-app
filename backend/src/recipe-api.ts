import 'dotenv/config'
const apiKey = process.env.API_KEY


const searchRecipes = async(searchTerm: string, page: number) => {

    if (!apiKey) {
        throw new Error("API key not found")
    }

    const url = new URL('https://api.spoonacular.com/recipes/complexSearch')

    const queryParams = {
        apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString()
    }

    url.search = new URLSearchParams(queryParams).toString()
    
    try {
        const searchResponse = await fetch(url)
        const resultsJson = await searchResponse.json()
        return resultsJson
    } catch (error) {
        console.log(error)
    }
}

const getRecipeSummary = async(recipeId:string) => {

    if (!apiKey) {
        throw new Error("API key not found")
    }

    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`)
    
    const params = {
        apiKey,
    }
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url)
    const jsonSumarryResults = await response.json()
    return jsonSumarryResults
}

const getFavouriteRecipesByIds = async(ids: string[]) => {

    if (!apiKey) {
        throw new Error("API key not found")
    }

    const url = new URL(`https://api.spoonacular.com/recipes/informationBulk`)
    const params = {
        apiKey,
        // converts array into string with comma separated values
        ids: ids.join(',')
    }
    
    url.search = new URLSearchParams(params).toString()
    const searchResponse = await fetch(url)
    const jsonFaveRecipes = await searchResponse.json()
    return { results: jsonFaveRecipes }
}

const recipeApi = {
    searchRecipes,
    getRecipeSummary,
    getFavouriteRecipesByIds
}

export default recipeApi