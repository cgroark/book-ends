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
            submitting: false        
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
            submitting: true
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
                showForm: false,
                submitting: false,
                userLast: ''
            })
        })
    }
    searchAgain = () => {
        this.setState({
            showForm: true,
            showResults: true,
            friendData: []
        })
    }
    friendsBooks(user){
        let friendBooks = this.state.allData.filter(book => book.username === user);
        console.log('username', user)
        this.setState({
            friendData: friendBooks,
            showResults: false
        })
    }
    renderFriend(){
        function capFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return this.state.allData.filter(friend => friend.lastName === this.state.pickedUser.toLowerCase()).map((each) => 
            <div key={each.id} className="found-friend">{capFirstLetter(each.firstName)} {capFirstLetter(each.lastName)}
                <button type="submit" className="div-button friend" onClick={() => this.friendsBooks(each.username)} >View books</button>   
            </div>
        )
    }

   

    render(){
        const {userLast, submitting, showForm, friendData, showResults, pickedUser, allData} = this.state;
        let numUsersFound =  allData.filter(friend => friend.lastName === pickedUser.toLowerCase()).length;
        return(
            <div className="main-body">
                <h2>Find your friends. Read their books.</h2>
                <hr  />
                {showForm &&
                    <div>
                        <p><strong>Search for your friends by last name</strong></p>
                        <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                            <label >Last name:<br />
                                    <input type="text" name='userLast' value={userLast} onChange={this.handleChange} /> 
                            </label>
                            <div id="input-section">
                                <input type='submit' disabled={submitting} value={submitting ? 'Searching..' : 'Search'}></input>
                            </div>
                        </form>
                    </div>
                }
                {!showForm &&
                     <div className="div-button" onClick={this.searchAgain}>Search again</div>   
                }
                {numUsersFound === 1 && !showForm &&
                    <div className="friend-results">
                        {showResults &&
                            <div><strong>Found user</strong>:&nbsp;<span>{this.renderFriend()}</span></div>
                        }
                        {friendData.length > 0 &&
                            <FriendData data={friendData}/>
                        }
                    </div>  
                }
                 {numUsersFound >1  && !showForm &&
                    <div className="friend-results">
                         {showResults &&
                            <div><strong>Found users</strong>:
                           
                                {this.renderFriend()}
                            </div>
                         }
                        {friendData.length > 1 &&
                            <FriendData data={friendData}/>
                        }
                    </div>  
                }
                {numUsersFound === 0 && !showForm &&
                    <div className="friend-results">
                        No users found
                    </div>  
                }
                 
            
            </div>
        )
    }
}

export default FindUser;

