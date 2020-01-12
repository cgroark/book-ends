import React from 'react';
import { Route, Link, NavLink, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import SignUp from './components/signup';
import SignIn from './components/signin';

class App extends React.Component {
  render(){

    return (
      <div className="App">
        <header className="App-header">
          <h1>Book Ends</h1>
        </header>
        <Router>
            <div>
              <ul className='signup-navigation'>
                  <li>
                  <NavLink exact activeClassName="active" to="/">Home</NavLink>
                  </li>
                  <li>
                  <NavLink activeClassName="active" to="/sign-up">Sign Up</NavLink>
                  </li>
                  <li>
                  <NavLink activeClassName="active" to="/sign-in">Sign In</NavLink>
                  </li>
              </ul>
              <Route exact path="/" component={Home} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/sign-in" component={SignIn} />
            </div>
          </Router>
      </div>
    )
  }
}

export default App;
