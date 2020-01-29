import React from 'react';
import { Route, NavLink, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import SignUp from './components/signup';
import SignIn from './components/signin';
import SignOut from './components/signout';
import BookForm from './components/bookform';
import FindUser from './components/finduser';



class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
        checkusername: false,
        savedusername: ''    }
  }
  componentDidMount = () => {
      let usernameData = localStorage.getItem('username');
      if(usernameData){
          this.setState({
              savedusername: usernameData,
              checkusername: true
          })
      }
  }
  updateNav = () =>{
    console.log('update nav')
    let usernameData = localStorage.getItem('username');
    this.setState({
      savedusername: usernameData,
      checkusername: !this.state.checkusername
  })
  }
  render(){
    const { checkusername, savedusername } = this.state;
        let mainNav;
        mainNav =
          <Router>
                {checkusername &&
                  <React.Fragment>
                    <NavLink exact activeClassName="active" to="/">  <i className="fa fa-book" aria-hidden="true"></i></NavLink>
                    <NavLink exact activeClassName="active" to="/sign-out">Logout</NavLink>
                    <NavLink exact activeClassName="active" to="/books" >Your books</NavLink>
                    <NavLink exact activeClassName="active" to="/friend-find" ><i className="fa fa-search" aria-hidden="true"></i>&nbsp;Friends' Books</NavLink>
                  </React.Fragment>
                }
                  {!checkusername &&
                  <React.Fragment>
                    <NavLink exact activeClassName="active" to="/">  <i className="fa fa-book" aria-hidden="true"></i></NavLink>
                    <NavLink exact activeClassName="active" to="/sign-up">Sign Up</NavLink>
                    <NavLink exact activeClassName="active" to="/sign-in" >Login</NavLink>
                  </React.Fragment>
                  }
                   <React.Fragment>
                    <Route exact path="/sign-out" render={() => <SignOut updateNav={this.updateNav} username={savedusername}/>} />
                    <Route exact path="/books" render={() => <BookForm name={this.state.savedusername} />} />
                    <Route exact path="/sign-up" render={() => <SignUp updateNav={this.updateNav}/>}  />
                    <Route exact path="/sign-in"  render={() => <SignIn updateNav={this.updateNav}/>} />
                    <Route exact path="/"  render={() => <Home updateNav={this.updateNav}/>} />
                    <Route exact path="/friend-find" render={() => <FindUser username={savedusername}/>} />

                  </React.Fragment>
          </Router>
    return(
      <div className="App">
        <header className="App-header" >
          <h1>Book Ends</h1>
        </header>
        <article>
        <div className="navigation">
          {mainNav}
        </div>
        </article>
       
      </div>
    
    )
  }
}

export default App;
