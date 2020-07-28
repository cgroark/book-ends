import React from 'react';
import moment from 'moment';
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
        <Row className='reading-now'>
                <Col sm={{ span: 3, offset: 4 }}>
                <div key={each.id}>
                    <h4><em>{each.title}</em></h4> 
                </div>
                </Col>
                <Col sm={2}>
                    <span>{each.image ? <img src={each.image} alt={each.title} />  :''}</span>
                </Col>
               
            </Row>
        )
    }
    renderFinishedData(){
        return this.state.friendData.filter(one => one.title && one.status === "Finished").sort((a,b) => new moment(a.date) - new moment(b.date)).map((each, index) => 
        <Col key={each.id} className="book-card" md={4}>
        <h4><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h4>
        <Row>
            <Col sm={8}>
                <p>{each.author}</p>
                <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                <p className="card-smaller">{each.rating} <a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
            </Col>
            <Col sm={4}>
                {each.image ?
                    <img src={each.image} alt={each.title} />
                    :
                    ''
                }
                
            </Col>
            
        </Row>
        {each.overview ? 
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
                <Col key={each.id} className="book-card" md={4}>
                     <h4><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h4>
                    <Row>
                        <Col sm={8}>
                            <p>{each.author}</p>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                        </Col>
                        <Col sm={4}>
                            {each.image ?
                                <img src={each.image} alt={each.title} />
                                :
                                ''
                            }
                            
                        </Col>
                        
                    </Row>
                    {each.overview ? 
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
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 && !searchloading &&
                <div>
                    <h2>Currently reading:</h2>
                    <h3> {this.renderReading()}</h3>
                        <hr />
                </div>
                }
                <div id="booklist"><h2>{firstName}'s book list</h2>
                    {bookCount > 1 && allBooks.filter(book => book.status === "Finished").length > 0 &&
                        <div>
                            <h3>Finished books</h3>
                            <Row>
                                {this.renderFinishedData()}
                            </Row>
                        </div>
                    }
                    {bookCount > 1 && allBooks.filter(book => book.status === "Want-to-read").length > 0 &&
                        <div>
                            <h3>Books {firstName} wants to read</h3>
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

