import React from 'react';
import { Route, NavLink, Switch, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import SignUp from './components/signup';
import SignIn from './components/signin';
import SignOut from './components/signout';
import BookForm from './components/bookform';
import FindUser from './components/finduser';
import FriendData from './components/friendData';
import history from './history';



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
      }
  }
  componentDidMount = () => {
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
  showSignout = () => {
    this.setState({
      signOut: !this.state.signOut
    })
  }
  showSignin = () => {
    this.setState({
      signIn: !this.state.signIn
    })
  }
  showSignup = () => {
    this.setState({
      signup: !this.state.signup
    })
  }
  newUser = () => {
    this.setState({
      newUser: true
    })
  }
  render(){
    const { checkusername, savedusername, signOut, signIn, signup, customHome, newUser, friendForm, friendUser } = this.state;
        let mainNav;
        mainNav =
          <Router>
                {checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                    <NavLink exact activeClassName="active" to="/">  <i className="fa fa-book" aria-hidden="true"></i></NavLink>
                    <NavLink exact activeClassName="active" to="/books" >Your books</NavLink>
                    <NavLink exact activeClassName="active" to="/friendsbooks" ><i className="fa fa-search" aria-hidden="true"></i>&nbsp;Friends</NavLink>
                    {/* <a onClick={this.showFriendform} ><i className="fa fa-search" aria-hidden="true"></i>&nbsp;Friends</a> */}
                    <a onClick={this.showSignout} >Sign out</a>
                  </React.Fragment>
                  </article>
                }
                  {!checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                      <NavLink exact activeClassName="active" to="/">  <i className="fa fa-book" aria-hidden="true"></i></NavLink>
                      <a onClick={this.showSignin} >Login</a>
                      <a onClick={this.showSignup} >Sign up</a>
                    </React.Fragment>
                  </article>
                  }
                   <Switch>
                    <Route exact path="/books" render={() => <BookForm name={savedusername}  />} />
                    <Route exact path="/friendsbooks" render={() => <FindUser currentusername={savedusername}/>}/>
                    <Route exact path="/friendsbooks/friend/:id" exact component={FriendData}/>
                    <Route exact path="/"  render={() => <Home customHome={customHome} newUser={newUser} username={this.state.savedusername}/>} />
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
