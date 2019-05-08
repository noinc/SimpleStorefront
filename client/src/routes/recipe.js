import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/recipe/';

export default [
  <Route path="/recipes/create" component={Create} exact key="create" />,
  <Route path="/recipes/edit/:id" component={Update} exact key="update" />,
  <Route path="/recipes/show/:id" component={Show} exact key="show" />,
  <Route path="/recipes/" component={List} exact strict key="list" />,
  <Route path="/recipes/:page" component={List} exact strict key="page" />
];
