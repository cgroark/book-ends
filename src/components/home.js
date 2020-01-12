import React from 'react';
import BookForm from './bookform';
import BookList from './booklist';


class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            checkusername: false,
            savedusername: ''
        }
    }
      componentDidMount = () => {
        let usernameData = sessionStorage.getItem('username');
        console.log(usernameData)
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
      }
      render(){
        const { savedusername, checkusername} = this.state;
        let welcomeContent;
        if(checkusername){
          welcomeContent = 
            <div><p>Welcome back {savedusername}. Check your list and add books below.</p>
            <div>
                <BookForm username={this.state.savedusername}/>
            </div>
            </div>
        }else{
          welcomeContent = 
        <p>Welcome to Book Ends. Use the navigation to sign-up or sign-in.</p>
        }
    return(
            <div>
                <h2>Welcome to Book Ends</h2>
                {welcomeContent}

            </div>
        )
    }
}

export default Home;