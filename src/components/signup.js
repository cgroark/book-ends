import React from 'react';

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
            bookid: ''
        }

    }
    componentDidMount =() => {
        console.log('mounted')
        let usernameData = localStorage.getItem('username');
        console.log(usernameData)
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
    }
    handleClear = () => {
        console.log('reached clear')
        localStorage.clear();
        this.setState({checkusername: false})
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    handleSubmit = event => {
        const dataSend = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            id: this.state.username+'id=0'
        }
        console.log(dataSend)
        event.preventDefault()
        this.setState({
            submitting: true
        })
        console.log('before fetch', this.state.submitting)
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
                submitting: false,
                firstName: '',
                lastName: '',
                username: '',
                done: true
            })
            console.log('done user', this.state.usernamedone)
            localStorage.setItem('username', this.state.usernamedone);
            this.props.updateNav();
            return response.json()
           
        });
      }
      render(){
        const { firstName, lastName, username, usernamedone, savedusername, checkusername} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(checkusername){
            pageContent = 
            <div className="login">
                    <p>Looks like you have already signed up as {savedusername}</p>
                    <p>Not {savedusername} or want to sign up another user? <a onClick={this.handleClear}>View sign-up form</a></p>
            </div>
        }else if(this.state.done){
            pageContent = 
            <div className="login">
                        <p>Thanks for signing up {usernamedone}
                        </p>
            </div>
        }else{
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
                <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Submit'}></input>
            </form>
            </div>
        }
        return(
            <div className="main-body">
                <h2>Sign up as a new user</h2>
                <hr  />
                {pageContent} 
            </div>    
        )
    }
}

export default SignUp;

