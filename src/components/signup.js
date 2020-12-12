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
            searchloading: false
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
    }
    handleClear = () => {
        localStorage.clear();
        this.setState({checkusername: false})
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    handleSubmit = event => {
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
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351', {
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
      render(){
        const { firstName, lastName, username, usernamedone, savedusername, checkusername, searchloading, done} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(!done && !searchloading){
            pageContent =
            <div  className="login">
            <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
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

