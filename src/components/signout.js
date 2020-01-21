import React from 'react';

class SignOut extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            loggedout: false
        }

    }
    componentDidMount = () => {
        let username = this.props.username;
        console.log('username on signout', username)
        if(username){
            this.setState({
                savedusername: username            })
        }
    }
    handleClear = () => {
        this.props.updateNav();
        console.log('reached clear')
        localStorage.clear();
        this.setState({
            loggedout: true
        })
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    render(){
        const { username, loggedout} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(loggedout){
            pageContent = 
            <div className="login">
                    <p>You've been logged out. Get back to your book.</p>
            </div>
        }else{
            pageContent = 
            <div className="login">
                <p><strong>Are you sure you want to sign out, {this.props.username}?</strong></p> 
                <div className="sign-out" onClick={this.handleClear}>Sign me out</div>       
            </div>
        }
        return(
            <React.Fragment>
            <h2>User logout</h2>
            {pageContent}
            </React.Fragment>
        )
    }
}

export default SignOut;

