import React from 'react';
import { Row, Col } from 'react-bootstrap';
import homeImage from '../images/mug-book.png';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            checkusername: false,
            savedusername: ''        }
    }
    componentDidMount = () => {
        let usernameData = localStorage.getItem('username');
        console.log('local storage', usernameData)
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
    }
    render(){
        const { savedusername, checkusername } = this.state;
        let welcomeContent;
        if(checkusername){
          welcomeContent = 
            <div>
                <h3>Welcome back {savedusername} </h3>
                <p>Use the navigation to view your book list, make updates, add new books.</p>
            </div>
        }else{
          welcomeContent =
            <div >
                <h2>Welcome to your new favorite reading tracker</h2>
                <p>Login to view your books or sign-up to create an account and start your list of books.</p>
            </div>
                   
        }
        return(
            <article className="welcome">
                <Row>
                <Col md={{ span: 6, offset: 2 }}>
                        {welcomeContent}
                </Col>
                <Col md={{ span: 3, offset: 1 }}>
                        <div>
                        <img src={homeImage} />
                        </div>
                    </Col>
                </Row>
            </article>
           
        )
    }
}

export default Home;