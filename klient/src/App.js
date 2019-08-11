import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import './App.css';
import Login from './components/Login';
import Chat from './components/Chat';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Login} />
          <Route  path='/room/:id' component={Chat} />
        </div>
      </Router>
    );
  }
}

export default App;