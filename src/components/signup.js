import React from 'react';
import moment from 'moment';

class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.state={
            submitting: false,
            firstName: '',
            lastName: '',
            username: '',
            checkusername: false,
            savedusername: '',
            done: false,
            usernamedone: '',
            bookid: '',
            searchloading: false,
            failedValidationCheck: false,
            failedDupCheck: false
        }

    }
    componentDidMount =() => {
        let usernameData = localStorage.getItem('username');
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
        this.getAllData()
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
            })
    }
    handleClear = () => {
        localStorage.clear();
        this.setState({checkusername: false})
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value,
        failedDupCheck: false,
        failedValidationCheck: false
 
    })
    handleSubmit = event => {
        let failedValidation = false;
        let failedDup = false;
        for(var i=0; i<this.state.username.length; i++){
            if(this.state.username[i] === ' '){
                failedValidation = true;
            }
        }
        for(var e = 0; e<this.state.allData.length; e++){
            if(this.state.allData[e].username === this.state.username){
                failedDup = true;
            }
        }
        if(failedDup === true){
            this.setState({
                failedDupCheck: true,
                username: '',
            })
            event.preventDefault()
        }
        else if(failedValidation === true){
            this.setState({
                failedValidationCheck: true,
                username: '',
            })
            event.preventDefault()
        }else{
            this.setState({
                failedDupCheck: false,
                failedValidationCheck: false
            })
            const dataSend = {
                firstName: this.state.firstName.toLowerCase(),
                lastName: this.state.lastName.toLowerCase(),
                username: this.state.username,
                id: this.state.username+'id=0',
                date: moment().toDate(),
                author: 'null',
                title: 'null',
                status: 'null',
                format: 'null',
                rating: 'null',
                overview: 'null',
                image: 'null',
                friends: 'null'
            }
            event.preventDefault()
            this.setState({
                searchloading: true
            })
            fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(dataSend)
            }).then( (response) => {
                this.setState({
                    usernamedone: this.state.username,
                    searchloading: false,
                    firstName: '',
                    lastName: '',
                    username: '',
                    done: true
                })
                localStorage.setItem('username', this.state.usernamedone);
                this.props.updateNav();
                this.props.showSignup();
                this.props.newUser();
                return response.json()
               
            });
          }
        }
      closeSignUp = () => {
        this.props.showSignup();
      }
      render(){
        const { firstName, lastName, username, searchloading, done, failedValidationCheck, failedDupCheck} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(!done && !searchloading){
            pageContent =
            <div  className="login">
            <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                <div className="close-button"><button  onClick={this.closeSignUp}>x</button></div>
                <p>
                    <label >First Name:<br />
                    <input type="text" name='firstName' value={firstName} onChange={this.handleChange} />
                        </label>
                </p>
                <p>
                    <label >Last Name:<br />
                        <input type="text" name='lastName' value={lastName} onChange={this.handleChange} /> 
                    </label>
                </p>
                <p>
                    <label>Create your username: <br />
                        <input type="text" name="username" value={username}  onChange={this.handleChange} />
                    </label>
                </p>
                {failedValidationCheck &&
                    <p className="error">Username must not contain any spaces</p>
                }
                {failedDupCheck &&
                    <p className="error">Username {username} already exists</p>
                }
                <input type='submit' disabled={submitting} value='Submit'></input>
            </form>
            </div>
        }else if(searchloading){
            pageContent = 
            <div><p>Adding new user...</p>
                <div className="progress-infinite">
                    <div className="progress-bar3" ></div>
                </div>
            </div>                
        }
        return(
            <div className="main-body">
                <div className="sign-widget">
                    {pageContent} 
                </div>
            </div>    
        )
    }
}

export default SignUp;

