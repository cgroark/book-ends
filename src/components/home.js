import React from 'react';
import { Row, Col } from 'react-bootstrap';
import homeImage from '../images/mug-book.png';
import Bestsellers from './bestsellers'

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
                <h2>Welcome back {this.props.username} </h2>
                <p>Use the navigation to view your book list, make updates, add new books.</p>
                
            </div>
        }else if(this.props.newUser)
            welcomeContent =
            <div >
                <h2>Welcome to Book Ends {this.props.username} </h2>
                <p>Use the navigation to view your book list, make updates, add new books.</p>
            </div>
        else{
          welcomeContent =
            <div >
                <h2>Welcome to your new favorite reading tracker</h2>
                <p>Login to view your books or sign-up to create an account and start your list of books.</p>
            </div>
                   
        }
        return(
            <article className="welcome">
                <Row>
                <Col md={8}>
                        {welcomeContent}
                </Col>
                <Col md={4}>
                        <div>
                        <img src={homeImage} alt="hands reaching a book with a cup of coffee nearby" />
                        </div>
                    </Col>
                </Row>
                <Bestsellers />
            </article>
           
        )
    }
}

export default Home;