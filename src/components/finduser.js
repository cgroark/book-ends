import React from 'react';
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
            username: this.props.username
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
    friendsBooks(user, first){
        let friendBooks = this.state.allData.filter(book => book.username === user);
        console.log('username', user)
        this.setState({
            friendData: friendBooks,
            showResults: false,
            selectedFirst: first
        })
    }
    renderFriend(){
        function capFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return this.state.allData.filter(friend => friend.lastName === this.state.pickedUser.toLowerCase()).map((each) => 
            <div key={each.id} className="found-friend">{capFirstLetter(each.firstName)} {capFirstLetter(each.lastName)}
                <button type="submit" className="div-button friend" onClick={() => this.friendsBooks(each.username, each.firstName)} >View books</button>   
            </div>
        )
    }

   

    render(){
        const {userLast, submitting, showForm, friendData, showResults, pickedUser, allData, searchloading, selectedFirst} = this.state;
        let numUsersFound =  allData.filter(friend => friend.lastName === pickedUser.toLowerCase()).length;
        return(
            <div className="main-body">
                <h1>Find your friends. Read their books.</h1>
                <hr  />
                {searchloading && 
                    <div class="progress-infinite">
                        <div class="progress-bar3" >
                        </div>                       
                    </div> 
                }
                
                {showForm && !searchloading &&
                    <div id="friend-form">
                        <p><strong>Search for your friends by last name</strong></p>
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
                        <div className="div-button" onClick={this.searchAgain}>Search again</div>   
                }
                {numUsersFound === 1 && !showForm && !searchloading &&
                    <div className="friend-results">
                        {showResults &&
                            <div><h3>Found user:</h3>&nbsp;<span>{this.renderFriend()}</span></div>
                        }
                        {friendData.length > 0 &&
                            <FriendData data={friendData} firstName={selectedFirst} />
                        }
                    </div>  
                }
                 {numUsersFound >1  && !showForm &&
                    <div className="friend-results">
                         {showResults &&
                            <div id="results"><h3>Found users:</h3>
                                {this.renderFriend()}
                            </div>
                         }
                        {friendData.length > 1 &&
                            <FriendData data={friendData} firstName={selectedFirst}/>
                        }
                    </div>  
                }
                {numUsersFound === 0 && !showForm && !searchloading &&
                    <div className="friend-results">
                        No users found
                    </div>  
                }
                 
            
            </div>
        )
    }
}

export default FindUser;

