import React from 'react';

class SignIn extends React.Component {
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
            usernamefound: false,
            allData: []
        }
    }
    componentDidMount = () => {
        this.getAllData()
        let usernameData = sessionStorage.getItem('username');
        console.log(usernameData)
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
                console.log('data', this.state.allData)
            })
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })

    handleSubmit = event => {
        event.preventDefault()
        let usernameEntered = {
            username: this.state.username
        }
        let allData = this.state.allData;
        this.setState({
            submitting: true
        })
        for(var i=0; i<allData.length; i++){
            console.log(allData[i].username)
            if(allData[i].username === this.state.username){
                console.log('we found ', this.state.username, ' and ', allData[i].username);
                this.setState({usernamefound: true})
                sessionStorage.setItem('username', this.state.username);

            }
        }
        this.setState({
            submitting: false
        })
    
    }
      render(){
        const { username, usernamedone, savedusername, checkusername} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(checkusername){
            pageContent = 
            <div className="signup-success">
                    <p>Looks like you are already signed in as {savedusername}</p>
                    <p>Not {savedusername} or want to sign up another user? <a>Go to the Sign Up page</a></p>
            </div>
        }else if(this.state.done){
            pageContent = 
            <div className="signup-success">
                        <p>Thanks for signing in {usernamedone}
                        </p>
            </div>
        }else if(this.state.usernamefound){
            pageContent = 
            <div className="signup-success">
                        <p>Welcome back {username}
                        </p>
            </div>
        }
        else{
            pageContent =
            <div>
            <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                <p>
                    <label>Enter your username: <br />
                        <input type="text" name="username" value={username}  onChange={this.handleChange} />
                    </label>
                </p>
                <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Submit'}></input>
            </form>
            </div>
        }
        return(
           <div>{pageContent} </div>    
        )
    }
}

export default SignIn;

