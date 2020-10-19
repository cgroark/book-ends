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
        if(username){
            this.setState({
                savedusername: username            })
        }
    }
    handleClear = () => {
        localStorage.clear();
        this.props.updateNav();
        this.setState({
            loggedout: true
        })
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    render(){
        const {loggedout} = this.state;
        let pageContent;
        if(loggedout){
            pageContent = 
            <div className="login">
                    <p>You've been logged out. Get back to your book.</p>
            </div>
        }else{
            pageContent = 
            <div className="login">
                <p><strong>Are you sure you want to sign out?</strong></p> 
                <div className="div-button" onClick={this.handleClear}>Sign me out</div>       
            </div>
        }
        return(
            <div className="main-body">
            <h1>User logout</h1>
            < hr />
            {pageContent}
            </div>
        )
    }
}

export default SignOut;

