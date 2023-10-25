import { Recipe } from "../types"
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

interface Props {
    key: number;
    recipe: Recipe | undefined;
    // since it's part of the prop, it needs to be defined here
    // it doesn't also return anything that's why 'void' is returned
    onClick: () => void;
    onFaveBtnClick: (recipe: Recipe) => void;
    isFavourite: boolean | undefined
}


const RecipeCard = ({ recipe, onClick, onFaveBtnClick, isFavourite }: Props) => {

    return (
        <div className="recipe-card" onClick={onClick}>
            <img src={recipe?.image}>
            </img>
            <div className="recipe-card-title">
                <span onClick={(e) => {
                    // since there is also a parent onClick event, you need to
                    // add e.stopPropagation so that the click on <AiOutlineHeart />
                    // will work
                    e.stopPropagation()
                    onFaveBtnClick(recipe as Recipe)
                }}>
                    { isFavourite 
                        ? <AiFillHeart size={25} color='red' /> 
                        : <AiOutlineHeart size={25} />
                    }
                    
                </span>
                <h3 className="recipe-title">
                    {recipe?.title}
                </h3>
            </div>
        </div>
    )
}

export default RecipeCard