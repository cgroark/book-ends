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
            submitting: false        }

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
        this.setState({submitting: true})
        this.setState({
            pickedUser: this.state.userLast
        })
        console.log("user search for was ", this.state.pickedUser);
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351')
        .then( (response) => {
            return response.json()
        }).then( (json) => {
            this.setState({
                allData: json
            })
        }).then( () => {
            console.log('over')
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
    friendsBooks(username){
        let friendBooks = this.state.allData.filter(book => book.username === username);
        this.setState({
            friendData: friendBooks,
            showResults: false
        })
        console.log(username, this.setState.friendData);
    }
    renderFriend(){
        console.log('friend name', this.state.pickedUser)
        return this.state.allData.filter(friend => friend.lastName.toLowerCase()=== this.state.pickedUser.toLowerCase()).map((each) => 
        <React.Fragment>
            <span key={each.id} className="found-friend">{each.firstName} {each.lastName}
                <button type="submit" className="div-button friend" onClick={() => this.friendsBooks(each.username)} >View books
            </button>   </span>
        </React.Fragment>
        
        )
    }

   

    render(){
        const {userLast, submitting, showForm, friendData, showResults} = this.state;
        let numUsersFound =  this.state.allData.filter(friend => friend.lastName.toLowerCase()=== this.state.pickedUser.toLowerCase()).length;
        console.log('LENGGTH', friendData.length,  friendData)
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
                            <p><strong>Found user</strong>:&nbsp;<span>{this.renderFriend()}</span></p>
                        }
                        {friendData.length > 0 &&
                            <FriendData data={friendData}/>
                        }
                    </div>  
                }
                 {numUsersFound >1  && !showForm &&
                    <div className="friend-results">
                        <p><strong>Found users</strong>:/</p>
                        {this.renderFriend()}
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

