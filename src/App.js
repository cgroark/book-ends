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
        savedusername: '',
        signOut: false    
      }
  }
  componentDidMount = () => {
    if(localStorage.getItem('username')){
      let usernameData = localStorage.getItem('username');
      this.setState({
        savedusername: usernameData,
        checkusername: true
    })
    }
    else{
      this.setState({
        checkusername: false
      })
    }
  }
  updateNav = () =>{
    if(localStorage.getItem('username')){
      let usernameData = localStorage.getItem('username');
      this.setState({
        savedusername: usernameData,
        checkusername: true
      })
    }
    else{
      this.setState({
        checkusername: false
      })
    }
  }
  showSignout = () => {
    console.log('show sign out');
    this.setState({
      signOut: !this.state.signOut
    })
  }
  render(){
    const { checkusername, savedusername, signOut } = this.state;
        let mainNav;
        mainNav =
          <Router>
                {checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                    <NavLink exact activeClassName="active" to="/">  <i className="fa fa-book" aria-hidden="true"></i></NavLink>
                    <NavLink exact activeClassName="active" to="/books" >Your books</NavLink>
                    <NavLink exact activeClassName="active" to="/friend-find" ><i className="fa fa-search" aria-hidden="true"></i>&nbsp;Friends' Books</NavLink>
                    <a onClick={this.showSignout} >Sign out</a>
                    {/* <NavLink exact activeClassName="active" to="/sign-out">Logout</NavLink> */}
                  </React.Fragment>
                  </article>
                }
                  {!checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                      <NavLink exact activeClassName="active" to="/">  <i className="fa fa-book" aria-hidden="true"></i></NavLink>
                      <NavLink exact activeClassName="active" to="/sign-up">Sign Up</NavLink>
                      <NavLink exact activeClassName="active" to="/sign-in" >Login</NavLink>
                    </React.Fragment>
                  </article>
                  }
                   <React.Fragment>
                    {/* <Route exact path="/sign-out" render={() => <SignOut updateNav={this.updateNav} username={savedusername}/>} /> */}
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
        <article  id="layout">
        <div >
          {mainNav}
          {signOut &&
              <SignOut updateNav={this.updateNav} username={savedusername}/>
          }
        </div>
        </article>
        <footer>
          <article className="footer">
            <div>&copy; 2020</div>
          </article>
        </footer>
      </div>
        
    
    )
  }
}

export default App;
