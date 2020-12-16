import React from 'react';
import { Link} from 'react-router-dom';
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
            selectedFirst: ''
        }

    }
    componentDidMount = () =>{
        this.props.pathname(window.location.pathname)
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
        fetch('https://sheet.best/api/sheets/2cbcb2a3-9df8-40e6-846b-fcb784df5c98')
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
                searchloading: true,
                selectedFirst: first.charAt(0).toUpperCase() + first.slice(1)
            })
            fetch('https://sheet.best/api/sheets/2cbcb2a3-9df8-40e6-846b-fcb784df5c98', {
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
        let currentFriends = [];
        function capFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        let usersFriends = this.state.allData.filter(each => each.username === this.props.currentusername && each.friends !== 'null');
        if(usersFriends.length > 0){
            for(var f=0; f<usersFriends.length; f++){
                currentFriends.push(usersFriends[f].friends)
            } 
        }
        return this.state.allData.filter(friend => friend.lastName === this.state.pickedUser.toLowerCase() && friend.username !== this.props.currentusername).map((each) => 
            <div key={each.id} className="found-friend">
                <h4>{capFirstLetter(each.firstName)} {capFirstLetter(each.lastName)}</h4>
                <Link to={'/friendsbooks/friend/'+each.firstName+'-'+each.lastName}>
                    View {capFirstLetter(each.firstName)}'s books
                </Link>
                {this.state.selectedFirst === capFirstLetter(each.firstName) ?
                    <p>You're now following {capFirstLetter(each.firstName)}!</p>
                :
                (currentFriends.indexOf(each.username) !== -1) ?
                    <p>You're already following {capFirstLetter(each.firstName)}!</p> 
                :
                <button type="submit" onClick={() => this.friendAdd(each.username, each.firstName, this.props.currentusername)} >Follow {capFirstLetter(each.firstName)}</button> 
                }
                <hr></hr>
            </div>
        )
    }
    render(){
        const {userLast, submitting, showForm, friendData, showResults, pickedUser, allData, searchloading, selectedFirst} = this.state;
        let numUsersFound =  allData.filter(friend => friend.lastName === pickedUser.toLowerCase()).length;
        return(
            <div className="main-body">
                
                <div className="searchfriend-widget">
                <h2>Search for friends</h2>
                {searchloading && 
                    <div className="progress-infinite">
                        <div className="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {showForm && !searchloading &&
                    <div id="friend-form">
                        
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

