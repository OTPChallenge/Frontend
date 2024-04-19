import logo from './logo.svg';
import './App.css';

import React, {createContext, useEffect, useState} from 'react'
import {BrowserRouter as Router, Route, Routes, Switch} from 'react-router-dom'
import Home from './home/home';

import ErrorPage from './commons/errorhandling/error-page';
import {AppProvider} from "./AppContext";

function App() {

  const [emailLoggedUser, setEmailLoggedUser] = useState("");

  useEffect(() => {
    setEmailLoggedUser(localStorage.getItem("emailLoggedUser"));
  })

  return (
      <AppProvider
          value={{emailLoggedUser, setEmailLoggedUser,}}
      >
        <div className="App">
          <Router>
            <div>
              <Switch>

                <Route
                    exact
                    path='/'
                    render={() => <Home/>}
                />
                
                {/*Error*/}
                <Route
                    exact
                    path='/error'
                    render={() => <ErrorPage/>}
                />

                <Route render={() =><ErrorPage/>} />
              </Switch>
            </div>
          </Router>
        </div>
       </AppProvider>
  );
}

export default App;
