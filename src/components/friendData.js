import React from 'react';
import moment from 'moment';
import Scrollspy from 'react-scrollspy';
import {Accordion, Card, Button, Col, Row } from 'react-bootstrap';

class FriendData extends React.Component {
    constructor(props){
        super(props);
        this.state={
           friendData: [],
           searchloading: true,
           firstName: ''
        }

    }
    componentDidMount =() => {
        this.setState({
            friendData: this.props.data,
            firstName: this.props.firstName[0].toUpperCase() + this.props.firstName.slice(1),
            searchloading: false
        })
        console.log('new component', this.props.data)
    }
    
    renderReading(){
        return this.state.friendData.filter(book => book.status === "Currently-Reading").map((each) => 
        <Col sm={6} key={each.id}  >
            <div >
            <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3> 
            </div>
            <Row>
                <Col xs={7}>
                    <div className="summary-reading">
                        <div >
                            <h4>{each.author}</h4>
                            <a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a>
                        </div>
                            {each.overview && each.overview !== 'null' ? 
                                        <Accordion defaultActiveKey="0">
                                                    <Card>
                                                        <Card.Header>
                                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                                Read summary
                                                            </Accordion.Toggle>
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey="1">
                                                            <Card.Body><p>{each.overview}</p></Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                        </Accordion>  
                                        : 
                                    <p>(No summary available)</p> }
                        </div>
                </Col>
                <Col xs={5}>
                    <span>
                    {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i class="fa fa-book" aria-hidden="true"></i>
                    }
                    </span>
                </Col>
            </Row>
        </Col>
        )
    }
    renderFinishedData(){
        return this.state.friendData.filter(one => one.title && one.status === "Finished").sort((a,b) => new moment(a.date) - new moment(b.date)).map((each, index) => 
        <Col key={each.id} className="book-card" md={4} sm={6}>
        <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
        <Row>
            <Col xs={8}>
                <h4>{each.author}</h4>
                <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                <p className="card-smaller">{each.rating} <a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
            </Col>
            <Col xs={4}>
                {each.image && each.image !== 'null' ?
                    <img src={each.image} alt={each.title} />
                    :
                    <i class="fa fa-book" aria-hidden="true"></i>
                }
            </Col>
            
        </Row>
        {each.overview && each.overview !== 'null' ? 
            <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Read summary
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body><p>{each.overview}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
            </Accordion>  
            : 
        <p>(No summary available)</p> }
   </Col>
        )
    }
    renderWantData(){
        return this.state.friendData.filter(one => one.title && one.status === "Want-to-read").map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                        </Col>
                        <Col xs={4}>
                            {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i class="fa fa-book" aria-hidden="true"></i>
                            }
                            
                        </Col>
                        
                    </Row>
                    {each.overview && each.overview !== 'null' ? 
                        <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                Read summary
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body><p>{each.overview}</p></Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                        </Accordion>  
                        : 
                    <p>(No summary available)</p> }
                </Col>
        )
    }
    render(){
    const { friendData, searchloading, firstName} = this.state;
    const allBooks = friendData;
    const bookCount = friendData.length;
    return(
            <div className="main-body">
                {searchloading && 
                    <div class="progress-infinite">
                        <div class="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {bookCount > 1 &&
                    <h2 id="friend-name">{firstName}'s book list</h2>
                }
                <div id="page-nav">
                    <Scrollspy items={ ['currently-reading', 'finished', 'want-to-read'] } currentClassName="is-current">
                        {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 &&
                            <li><a href="#currently-reading">Current ></a></li>
                        }   
                        {bookCount > 1 && allBooks.filter(book => book.status === "Finished").length > 0 &&
                            <li><a href="#finished">Finished ></a></li>
                        }
                        {bookCount > 1 && allBooks.filter(book => book.status === "Want-to-read").length > 0 &&
                            <li><a href="#want-to-read">Book list ></a></li> 
                        }
                    </Scrollspy>
                </div>
                
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 && !searchloading &&
                <div className="currently" >
                    <div id="currently-reading">
                    <h2>Currently reading:</h2>
                    <Row className='reading-now'>
                        {this.renderReading()}  
                    </Row>
                    </div>
                </div>
                }
                <div id="booklist">
                    {bookCount > 1 && allBooks.filter(book => book.status === "Finished").length > 0 &&
                        <div id="finished">
                            <h2>Finished books</h2>
                            <Row>
                                {this.renderFinishedData()}
                            </Row>
                        </div>
                    }
                    {bookCount > 1 && allBooks.filter(book => book.status === "Want-to-read").length > 0 &&
                        <div id="want-to-read">
                            <h2>Books {firstName} wants to read</h2>
                            <Row>
                                {this.renderWantData()}
                            </Row>
                        </div>
                    }

                </div>

            </div>
        )
    }
}

export default FriendData;

