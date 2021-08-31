
import './App.css';
import ReactDOM from 'react-dom'
import React from 'react'
import { render } from "react-dom";
import axios from "axios";
import Home from './Home';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import User from './User';

function App() {
  if(window.location.href=='http://localhost:3000/'){
    window.location.href = 'http://localhost:3000/home';
  }
  return (
    <div className="App">
     <BrowserRouter>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/user">
            <User />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
