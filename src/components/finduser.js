import React from 'react';
import { Row, Col } from 'react-bootstrap';



class FindUser extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            userLast: '',
            allData: [],
            userFoundData: [],
            submitting: false,
            foundData: false
        }

    }
    componentDidMount = () =>{
        console.log('find user', this.props.username)
        this.setState({
            username: this.props.username
        })
    }

    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    handleSubmit = (event) => {
        event.preventDefault()
        console.log("user search for was ", this.state.userLast);
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351')
        .then( (response) => {
            return response.json()
        }).then( (json) => {
            console.log('json', json, this.state.userLast)
            this.setState({
                allData: json
            })
        }).then( () => {
            console.log('over')
        })
    }
    
    renderFriend(){
        console.log('friend name', this.state.userLast)
        return this.state.allData.filter(friend => friend.lastName=== this.state.userLast).map((each) => 
    <div>Found user {each.firstName} {each.lastName} 
        <div>See {each.firstName}'s books</div>
    </div>
        )
    }

   

    render(){
        const {userLast, submitting, userFoundData, foundData} = this.state;
        return(
            <div className="main-body">
                <h2>Find your friends, read their books.</h2>
                <hr  />
                <p><strong>Search for your friends by last name</strong></p>
                <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                <label >Last name:<br />
                        <input type="text" name='userLast' value={userLast} onChange={this.handleChange} /> 
                </label>
                <div id="input-section">
                    <input type='submit' disabled={submitting} value={submitting ? 'Searching..' : 'Search'}></input>
                </div>
                </form>
            
                <div>
                    {this.renderFriend()}
                </div>    
            
            </div>
        )
    }
}

export default FindUser;

