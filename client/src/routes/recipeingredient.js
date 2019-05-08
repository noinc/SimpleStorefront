import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/recipeingredient/';

export default [
  <Route path="/recipe_ingredients/create" component={Create} exact key="create" />,
  <Route path="/recipe_ingredients/edit/:id" component={Update} exact key="update" />,
  <Route path="/recipe_ingredients/show/:id" component={Show} exact key="show" />,
  <Route path="/recipe_ingredients/" component={List} exact strict key="list" />,
  <Route path="/recipe_ingredients/:page" component={List} exact strict key="page" />
];
