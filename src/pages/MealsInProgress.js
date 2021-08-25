import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchMealRecipe } from '../services/fetchRecipe';
import { IngredientsTaskList } from '../components';
import {
  addIngInProgressStorage,
  rmvIngFromProgressStorage,
  isMealInLocalStorage,
} from '../helpers/inProgressLocalStorage';
import './css/MealsInProgress.css';

function MealsInProgress() {
  const { id } = useParams();
  const history = useHistory();
  const [rcp, setRcp] = useState({
    ingList: [],
  });
  const [btnDisable, setBtnDisable] = useState(true);

  useEffect(() => {
    async function getRcps() {
      const response = await fetchMealRecipe(id, 'meal');
      const ingredients = Object.keys(response)
        .filter((e) => e.includes('strIngredient') && response[e])
        .map((e) => ({
          ing: response[e],
          checked: isMealInLocalStorage(response[e], id),
        }));

      setRcp({ ...response, ingList: ingredients });
    }
    getRcps();
  }, [id]);

  const handleCheckIngredient = ({ target }) => {
    const { checked, name } = target;
    const { ingList } = rcp;
    const ingredientIndex = ingList.findIndex((e) => e.ing === name);

    setRcp({
      ...rcp,
      ingList: [
        ...ingList.slice(0, ingredientIndex),
        { ing: name, checked },
        ...ingList.slice(ingredientIndex + 1),
      ],
    });

    if (checked) return addIngInProgressStorage(id, name, 'meals');
    rmvIngFromProgressStorage(id, name, 'meals');
  };

  function isFinished() {
    const { ingList } = rcp;
    setBtnDisable(!ingList.every(({ checked }) => checked));
  }

  useEffect(isFinished, [rcp]);

  return (
    <>
      <img data-testid="recipe-photo" src={ rcp.strMealThumb } alt={ rcp.strMeal } />
      <h1 data-testid="recipe-title">{rcp.strMeal}</h1>
      <button data-testid="share-btn" type="button">
        Compartilhar
      </button>
      <button data-testid="favorite-btn" type="button">
        Favoritar
      </button>
      <p data-testid="instructions">{rcp.strInstructions}</p>
      <h3 data-testid="recipe-category">{rcp.strCategory}</h3>
      <IngredientsTaskList
        ingList={ rcp.ingList }
        handleCheckIngredient={ handleCheckIngredient }
      />
      <button
        data-testid="finish-recipe-btn"
        type="button"
        disabled={ btnDisable }
        onClick={ () => history.push('/receitas-feitas') }
      >
        Finalizar
      </button>
    </>
  );
}

export default MealsInProgress;
