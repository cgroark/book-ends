import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Bestsellers from './bestsellers';
import Bookfeed from './bookfeed';
import Scrollspy from 'react-scrollspy';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            checkusername: false,
            savedusername: '',
            allData: [],
            userData: []
        }
    }
    componentDidMount = () => {
        this.props.pathname(window.location.pathname)
        let usernameData = this.props.username;
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            }) 
        }
        this.getAllData();
    }
  
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/2cbcb2a3-9df8-40e6-846b-fcb784df5c98')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
            }).then( () => {
                this.setState({
                    userData: this.state.allData.filter(one => one.username === this.state.savedusername)
                })
            })
    }
    renderReading(){
        return this.state.allData.filter(each => each.username === this.props.username && each.status === "Currently-Reading").map((each) => 
            <Col key={each.id} xs={6}>
                <span>{each.image && each.image !== 'null' ?
                            <img src={each.image} alt={each.title} />
                            :
                            <i className="fa fa-book" aria-hidden="true"></i>
                        }
                </span>
            </Col>
        
        )
    }
    render(){
        const { savedusername} = this.state;
        let currentRead = this.state.allData.filter(each => each.username === this.props.username && each.status === "Currently-Reading");
        let friendsNum = this.state.allData.filter(each => each.username === this.props.username && each.friends !== "null");
        console.log('friends num', friendsNum)
        let welcomeContent;
        let sideContent;
        let homepageBreadcrumbs = 
            <div id="home-breadcrumbs">
                <div className="page-nav">
                    <Scrollspy items={ ['book-feed', 'best-sellers'] } currentClassName="is-current">
                        {friendsNum.length > 1 &&
                            <li><a href="#book-feed">Connections ></a></li>
                        }
                        <li><a href="#best-sellers">Bestsellers ></a></li>
                    </Scrollspy>
                </div>
            </div>
        if(currentRead.length > 0 && this.props.customHome){
            sideContent =     
                <div id="current-home">
                    <Row>
                        <Col xs={6}>
                        <h3>You're currently reading:</h3>
                        </Col>
                        {this.renderReading()}
                    </Row>
                </div>
        }
        if(this.props.customHome && !this.props.newUser){
          welcomeContent = 
            <div className="welcome-top">
                <h1>Welcome back {this.props.username} </h1>
                <p>View your <Link to='/books'>book list</Link> to make updates and add new books.</p>
                <p><Link to={'/friendsbooks'}>Find friends and follow</Link> to see what they're reading and recommend. </p>
            </div>
            
        }else if(this.props.newUser){
            welcomeContent =
                <div className="welcome-top">
                    <h1>Welcome to Book Ends {this.props.username} </h1>
                    <p>View your <Link to='/books'>book list</Link> to make updates and add new books.</p>
                    <p><Link to={'/friendsbooks'}>Find friends and follow</Link> to see what they're reading and recommend. </p>
                </div>
            
        }else{
            welcomeContent =
                <div className="welcome-top">
                    <h1>Welcome to your new favorite reading tracker</h1>
                    <p>Login to view your books or sign-up to create an account and start your list of books.</p>
                </div>
        }
        return(
            <article className="welcome">
                <Row>
                <Col md={7}>
                        {welcomeContent}
                        {sideContent}
                        {homepageBreadcrumbs}
                        {this.props.customHome &&
                            <Bookfeed currentuser={savedusername}/>
                        }
                </Col>
                <Col md={5}>
                    <div>
                        <Bestsellers />
                    </div>
                    </Col>
                </Row>

            </article>
           
        )
    }
}

export default Home;