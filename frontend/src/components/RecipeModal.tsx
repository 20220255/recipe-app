import { useState, useEffect } from 'react'
import { RecipeSummary } from '../types'
import api from '../api'
// import * as DOMPurify from 'dompurify';

interface Props {
    recipeId: number;
    onClose:()=>void
}

const RecipeModal = ({recipeId, onClose}:Props) => {

    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>()

    useEffect(() => {
        const fetchRecipeSummary = async () => {
            try {
                const apiRecipeSummary = await api.getRecipeSummary(recipeId)
                setRecipeSummary(apiRecipeSummary)
            } catch (error) {   
                console.log(error)
            }
        }

        fetchRecipeSummary()
    }, [recipeId])

    if (!recipeSummary) {
        return<></>
    }

    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{recipeSummary.title}</h2>
                        <span className="close-button" onClick={onClose} >
                            &times;
                        </span>
                    </div>
                    <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}} />

                    {/* <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}}>
                        RECIPE SUMMARY
                    </p> */}
                </div>
            </div>
        </>
    )
}

export default RecipeModal