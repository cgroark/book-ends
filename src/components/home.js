import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { NavLink, Link} from 'react-router-dom';
import homeImage from '../images/mug-book.png';
import Bestsellers from './bestsellers';
import Bookfeed from './bookfeed';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            checkusername: false,
            savedusername: ''
        }
    }
    componentDidMount = () => {
        let usernameData = localStorage.getItem('username');
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
    }

    render(){
        const { savedusername, checkusername, nytFiction, nytnonFiction } = this.state;
        let welcomeContent;
        if(this.props.customHome && !this.props.newUser){
          welcomeContent = 
            <div>
                <h1>Welcome back {this.props.username} </h1>
                <p>View your <Link to='/books'>book list</Link> to make updates and add new books.</p>
                
            </div>
        }else if(this.props.newUser)
            welcomeContent =
            <div >
                <h1>Welcome to Book Ends {this.props.username} </h1>
                <p>View your <Link to='/books'>book list</Link> to make updates and add new books.</p>
            </div>
        else{
          welcomeContent =
            <div >
                <h1>Welcome to your new favorite reading tracker</h1>
                <p>Login to view your books or sign-up to create an account and start your list of books.</p>
            </div>
                   
        }
        return(
            <article className="welcome">
                <Row>
                <Col md={7}>
                        {welcomeContent}
                </Col>
                <Col md={5}>
                        <div>
                        <img src={homeImage} alt="hands reaching a book with a cup of coffee nearby" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={7} >
                        <Bookfeed currentuser={savedusername}/>
                    </Col>
                    <Col md={5} >
                        <Bestsellers />
                    </Col>
                </Row>
                
            </article>
           
        )
    }
}

export default Home;