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
            allData: [],
            searchloading: false
        }
    }
    componentDidMount = () => {
        this.getAllData()
        let usernameData = localStorage.getItem('username');
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
            })
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })

    handleSubmit = event => {
        let allData = this.state.allData;
        this.setState({
            searchloading: true
        })
        for(var i=0; i<allData.length; i++){
            if(allData[i].username === this.state.username){
                this.setState({usernamefound: true})
                localStorage.setItem('username', this.state.username);

            }
        }
        this.setState({
            searchloading: false
        })
    
    }
      render(){
        const { username, usernamedone, savedusername, checkusername, searchloading, done, usernamefound} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(checkusername){
            pageContent = 
            <div className="login">
                    <p>Looks like you are already signed in as {savedusername}</p>
                    <p>Not {savedusername} or want to sign up another user? Logout and then login or sign-up.</p>
                    
            </div>
        }else if(done){
            pageContent = 
            <div className="login">
                        <p>Thanks for signing in {usernamedone}</p>
                        
            </div>
        }else if(usernamefound && !searchloading){
            pageContent = 
            <div className="login">
                        <h3>Welcome back {username}</h3>
                        <p>Use the navigation to view your book list, make updates, add new books.</p>   
                         
            </div>
        }
        else{
            pageContent =
            <div className="login">
            <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                <p>
                    <label>Enter your username: <br />
                        <input type="text" name="username" value={username}  onChange={this.handleChange} />
                    </label>
                </p>
                <input type='submit' onClick={this.props.updateNav} disabled={submitting} value='Sign In'></input>
            </form>
            </div>
        }
        return(
            <div className="main-body">
                <h2>User login</h2>
                <hr  />
                {searchloading && 
                    <div class="progress-infinite">
                        <div class="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {pageContent} 
            </div>    
        )
    }
}

export default SignIn;

