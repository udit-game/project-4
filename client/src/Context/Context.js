// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToke] = useState(null);
  const [filterPopOn, setfilterPopOn] = useState(false);
  const [RecipeFormOn, setRecipeFormOn] = useState(false);


  //for recipe page
  const [Recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  function recipeList(foodName) {
  const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/recipes/auto-complete',
      params: {
        prefix: foodName
      },
      headers: {
        'X-RapidAPI-Key': 'ef24f92790msh5f8fd453f36f9b4p1f5047jsn257f875a750d',
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    };

    return options;
  }

  const checktoken = async ({token}) => {
     try {
       localStorage.setItem('token', token);
       const response = await axios.post('http://localhost:8080/verify-token', {token: token});
     if (response.status === 200) {
       const userData = response.data; // Assuming the server sends back user information
       setUser(userData);
       setToke(token);
     }
     } catch (error) {
       console.error('Error:', error);
     }
  };
  const edmam_ID = 'dfb21f1e'; // Replace with your Edamam API ID
  const edmam_KEY = 'a3ee5e82f4332dc59c4211a14b845e3a'; // Replace with your Edamam API Key




    const logout = () => {
        setUser(null);
        localStorage.removeItem('token')
      };

      return (
        <AuthContext.Provider value={{ token, user, checktoken, logout, recipeList, edmam_ID, edmam_KEY, setfilterPopOn, filterPopOn }}>
          {children}
        </AuthContext.Provider>
      );
    };

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };