import React from 'react';
import { Route, NavLink, Switch, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import SignUp from './components/signup';
import SignIn from './components/signin';
import SignOut from './components/signout';
import BookForm from './components/bookform';
import FindUser from './components/finduser';
import FriendData from './components/friendData';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
        checkusername: false,
        savedusername: '',
        signOut: false,
        signIn: false,
        signup: false,
        newUser: false,
        customHome: false, 
        pathname: ''
      }
  }
  componentDidMount = () => {
    const pathname = window.location.pathname;
    this.setState({
      pathname: pathname
    })
    if(localStorage.getItem('username')){
      let usernameData = localStorage.getItem('username');
      this.setState({
        savedusername: usernameData,
        checkusername: true,
        customHome: true
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
        checkusername: true,
        customHome: true
      })
    }
    else{
      this.setState({
        checkusername: false,
        customHome: false,
        savedusername: '',
      })
    }
  }
  getPathName = (pathname) => {
    this.setState({
      pathname: pathname
    })
  }
  showSignout = () => {
    this.setState({
      signOut: !this.state.signOut
    })
  }
  showSignin = () => {
    this.setState({
      signIn: !this.state.signIn,
      signup: false
    })
  }
  showSignup = () => {
    this.setState({
      signup: !this.state.signup,
      signIn: false
    })
  }
  showHome = () => {
    this.setState({
      signup: false,
      signIn: false,
      signOut: false
    })
  }
  newUser = () => {
    this.setState({
      newUser: true
    })
  }
  render(){
    const { checkusername, savedusername, signOut, signIn, signup, customHome, newUser, pathname} = this.state;
        let mainNav;
        mainNav =
          <Router>
                {checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                    <NavLink exact activeClassName="active" to="/" onClick={this.showHome}><i className="fa fa-book" aria-hidden="true"></i>&nbsp;Home</NavLink>
                    <NavLink exact activeClassName="active" to="/books" >Your books</NavLink>
                    <NavLink exact activeClassName="active" to="/friendsbooks" ><i className="fa fa-search" aria-hidden="true"></i>&nbsp;Friends</NavLink>
                    {pathname === '/' &&
                      <a onClick={this.showSignout} >Sign out</a>
                    }
                  </React.Fragment>
                  </article>
                }
                  {!checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                      <NavLink exact activeClassName="active" to="/" onClick={this.showHome}><i className="fa fa-book" aria-hidden="true"></i>&nbsp;Home</NavLink>
                      <a onClick={this.showSignin} >Login</a>
                      <a onClick={this.showSignup} >Sign up</a>
                    </React.Fragment>
                  </article>
                  }
                   <Switch>
                    <Route exact path="/books" render={() => <BookForm name={savedusername} pathname={this.getPathName}  />} />
                    <Route exact path="/friendsbooks" render={() => <FindUser currentusername={savedusername} pathname={this.getPathName}/>}/>
                    <Route exact path="/friendsbooks/friend/:id" exact component={FriendData} pathname={this.getPathName}/>
                    <Route exact path="/"  render={() => <Home customHome={customHome} newUser={newUser} username={this.state.savedusername} pathname={this.getPathName}/>} />
                  </Switch>
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
                <SignOut updateNav={this.updateNav} showSignout={this.showSignout} username={savedusername}/>
          }
          {signIn &&
                <SignIn updateNav={this.updateNav} showSignin={this.showSignin} username={savedusername}/>
          }
          {signup &&
                <SignUp updateNav={this.updateNav}  newUser={this.newUser} showSignup={this.showSignup} username={savedusername}/>
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
