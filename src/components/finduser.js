import React from 'react';
import { Row, Col } from 'react-bootstrap';



class FindUser extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            userLast: '',
            allData: [],
            userFoundData: '',
            submitting: false,
            foundData: false
        }

    }
    componentDidMount = () =>{
        console.log('find user', this.props.username)
        this.setState({
            username: this.props.username
        })
        this.getAllData();
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
    handleSubmit = () => {
        console.log("user search for was", this.state.userLast);
        let userFound = this.state.allData.filter(one => one.lastName == this.state.userLast)[0];
        console.log('found user data', userFound)
        this.setState({
            userFoundData: userFound,
            submitting: false,
            foundData:true
        })
    }
    renderUserList(){
        return this.state.userFoundData.map((each) =>
           <div>
            <span>{each.lastName}</span>
            <span>{each.firstName}</span>
           </div>
        )
    }

    renderReading(){
        return this.state.allData.filter(book => book.username === this.state.username && book.status === "Currently-Reading").map((each) => 
        <span>{each.title}</span>
        )
    }

    render(){
        const {userLast, submitting, userFoundData, foundData} = this.state;
        console.log('render found data', userFoundData)
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
            {foundData &&
            <div>
            {this.renderUserList()}
            </div>    
            }
            </div>
        )
    }
}

export default FindUser;

