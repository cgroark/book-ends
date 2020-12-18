import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import moment from 'moment';



class Bookfeed extends React.Component {
    constructor(props){
        super(props);
        this.state={
            checkusername: false,
            savedusername: '',
            allData: [],
            userData: []
        }
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
            }).then( () => {
                this.setState({
                    userData: this.state.allData.filter(one => one.username === this.state.savedusername && one.friends !== 'null')
                });
            })
    }
    componentDidMount = () => {
        let usernameData = localStorage.getItem('username');
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            })
        }
        this.getAllData();
    }
    renderBookFeed(){
        let userData = this.state.userData;
        let feed = []
        for(let i = 0; i<userData.length; i++){
            feed.push(this.state.allData.filter(one => one.username === this.state.userData[i].friends))
        }
        let feedData = []
        for(let j=0;j<feed.length; j++){
            var firstNameFind = feed[j].filter(each => each.firstName !== 'null');
            let firstName = firstNameFind[0].firstName;
            let lastName = firstNameFind[0].lastName;
            let userName = firstNameFind[0].username;
            var findReading = feed[j].filter(each => each.status === "Currently-Reading");
            let currentlyReading;
            let currentAuthor; 
            let currentImg; 
            let lastRec;
            if(findReading.length > 0){
                currentlyReading = findReading[0].title;
                currentAuthor = findReading[0].author;
                currentImg = findReading[0].image;
            }
            var allDone = feed[j].filter(each => each.status === 'Finished').sort((a,b) => new moment(a.date) - new moment(b.date))
            let lastTitle;
            let lastAuthor;
            let lastImage;
            if(allDone.length > 0){
                lastTitle = allDone[allDone.length-1].title;
                lastAuthor = allDone[allDone.length-1].author;
                lastImage = allDone[allDone.length-1].image;
                lastRec = allDone[allDone.length-1].rating;
            }
            feedData.push(
                {
                    first: firstName[0].toUpperCase() + firstName.slice(1),
                    last: lastName[0].toUpperCase() + lastName.slice(1),
                    currentTitle: currentlyReading,
                    currentAuthor: currentAuthor,
                    currentImg: currentImg,
                    lastTitle: lastTitle,
                    lastAuthor: lastAuthor,
                    lastImg: lastImage,
                    lastRec: lastRec,
                    username: userName,
                    index: j
                }
            )
        }
        return feedData.map((each) => 
            <div key={each.first} className="feed-section">
                <Row>
                    <Col xs={8} className="reading-now">
                    <h4>{each.first} {each.last} is reading:</h4>
                        <p><em>{each.currentTitle}</em> by {each.currentAuthor}</p>
                    </Col>
                    <Col xs={4}>
                        <span>{each.currentImg && each.currentImg !== 'null' ?
                                    <img src={each.currentImg} alt={each.currentTitle} />
                                    :
                                    <i className="fa fa-book" aria-hidden="true"></i>
                                }
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={8} className="last-read">
                    <h4>{each.first} last read:</h4>
                        <p><em>{each.lastTitle}</em> by {each.lastAuthor}</p>
                        <p>{each.first}'s rating: ({each.lastRec})</p>
                    </Col>
                    <Col xs={4}>
                        <span>{each.lastImg && each.lastImg !== 'null' ?
                                    <img src={each.lastImg} alt={each.lastTitle} />
                                    :
                                    <i className="fa fa-book" aria-hidden="true"></i>
                                }
                        </span>
                    </Col>
                </Row>  
                <div className="feed-friend">
                    <Link to={'/friendsbooks/friend/'+each.first+'-'+each.last}>
                        View {each.first}'s books
                    </Link>
                </div>
            </div>
    )
    }
    render(){
        const { userData } = this.state;
        return(
            <div>
                {userData.length > 0 &&
                <div id="book-feed">
                    <h2>Your connections</h2>
                    {this.renderBookFeed()}
                </div>
                }
            </div>
        )
    }
}

export default Bookfeed;