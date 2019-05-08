import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/ingredient/';

export default [
  <Route path="/ingredients/create" component={Create} exact key="create" />,
  <Route path="/ingredients/edit/:id" component={Update} exact key="update" />,
  <Route path="/ingredients/show/:id" component={Show} exact key="show" />,
  <Route path="/ingredients/" component={List} exact strict key="list" />,
  <Route path="/ingredients/:page" component={List} exact strict key="page" />
];
