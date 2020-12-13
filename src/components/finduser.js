import React from 'react';
import { Route, NavLink, Link, withRouter, useHistory, BrowserRouter as Router } from 'react-router-dom';
import history from '../history';
import { Row, Col } from 'react-bootstrap';
import FriendData from './friendData';

class FindUser extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            userLast: '',
            allData: [],
            userFoundData: [],
            showForm: true,
            showResults: true,
            friendData: [],
            pickedUser: '',
            submitting: false,
            searchloading: false,
            selectedFirst: '',     
        }

    }
    componentDidMount = () =>{
        this.setState({
            username: this.props.currentusername
        })
    }

    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            pickedUser: this.state.userLast,
            searchloading: true,
            showForm: false
        })
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351')
        .then( (response) => {
            return response.json()
        }).then( (json) => {
            this.setState({
                allData: json
            })
        }).then( () => {
            this.setState({
                searchloading: false,
                userLast: ''
            })
        })
    }
    searchAgain = () => {
        this.setState({
            showForm: true,
            showResults: true,
            selectedFirst: '',
            friendData: []
        })
    }
    friendAdd(user, first, currentusername){
        console.log('username to follow', user, currentusername);
            const dataSend = {
                firstName: 'null',
                lastName: 'null',
                username: currentusername,
                id: 'null',
                date: 'null',
                author: 'null',
                title: 'null',
                status: 'null',
                format: 'null',
                rating: 'null',
                overview: 'null',
                image: 'null',
                friends: user
            }
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
                    searchloading: false,
                    done: true
                })
                
                return response.json()
               
            });
    }
    renderFriend(){
        function capFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return this.state.allData.filter(friend => friend.lastName === this.state.pickedUser.toLowerCase()).map((each) => 
            <div key={each.id} className="found-friend">
                <h4>{capFirstLetter(each.firstName)} {capFirstLetter(each.lastName)}</h4>
                <Link to={'/friendsbooks/friend/'+each.firstName+'-'+each.lastName}>
                    View {each.firstName.charAt(0).toUpperCase() + each.firstName.slice(1)}'s books
                </Link>
                <button type="submit" className="div-button friend" onClick={() => this.friendAdd(each.username, each.firstName, this.props.currentusername)} >Follow {capFirstLetter(each.firstName)}</button>  
            </div>
        )
    }
    render(){
        const {userLast, submitting, showForm, friendData, showResults, pickedUser, allData, searchloading, selectedFirst} = this.state;
        let numUsersFound =  allData.filter(friend => friend.lastName === pickedUser.toLowerCase()).length;
        return(
            <div className="main-body">
                <div className="searchfriend-widget">
                {searchloading && 
                    <div className="progress-infinite">
                        <div className="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {showForm && !searchloading &&
                    <div id="friend-form">
                        <p><strong>Search for friends by last name</strong></p>
                        <div className="login">
                        <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                            <label >Last name:<br />
                                    <input type="text" name='userLast' value={userLast} onChange={this.handleChange} /> 
                            </label>
                            <div id="input-section">
                                <input type='submit' disabled={submitting} value='Search'></input>
                            </div>
                        </form>
                        </div>
                    </div>
                }
                {!showForm && !searchloading &&
                    <div className="friend-results">
                        {showResults &&
                            <div>{this.renderFriend()}</div>
                        }
                        
                    </div>  
                }
                {!showForm && !searchloading &&
                        <div className="div-button" onClick={this.searchAgain}>Search again</div>   
                }
                {numUsersFound === 0 && !showForm && !searchloading &&
                    <div className="friend-results">
                        No users found
                    </div>  
                }
                 
                </div>
                {friendData.length > 0 && 
                            <FriendData data={friendData} firstName={selectedFirst} />
                        }
            </div>
        )
    }
}

export default FindUser;

