import React from 'react';
import { Row, Col, Accordion, Card, Button } from 'react-bootstrap';

class Bestsellers extends React.Component {
    constructor(props){
        super(props);
        this.state={
            nytFiction: [],
            nytnonFiction: []
        }
    }
    componentDidMount = () => {
        this.getNYTbooks()
    
    }
    getNYTbooks = () => {
        fetch('https://api.nytimes.com/svc/books/v3/lists/hardcover-fiction.json?api-key=BAGqFvDh9IJi1JWLxfJ9SIh2rctbgwiE')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    nytFiction: json.results.books
                })
                console.log(this.state.nytFiction)
            })
        fetch('https://api.nytimes.com/svc/books/v3/lists/hardcover-nonfiction.json?api-key=BAGqFvDh9IJi1JWLxfJ9SIh2rctbgwiE')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    nytnonFiction: json.results.books
                })
                console.log(this.state.nytnonFiction)
            })
    }
    renderBestSellersFiction(){
        let fictionBests = this.state.nytFiction;
        let fictionSix = [];
        if(fictionBests.length>0){
            for(var i=0;i<6;i++){
                fictionSix.push(fictionBests[i])
            }
       
            return fictionSix.map((each) => 
                <Col key={each.primary_isbn13} xs={6} md={3} lg={2} className="bestsellers" >
                    <img src={each.book_image} alt={each.title} />
                    <p><strong><em>{each.title}</em></strong></p>
                    <p>By <strong>{each.author}</strong></p>
                </Col>
            )
        }
    }
    renderBestSellersnonFiction(){
        let nonfictionBests = this.state.nytnonFiction;
        let nonfictionSix = [];
        let nonfictionRest = [];
        if(nonfictionBests.length>0){
            for(var i=0;i<6;i++){
                nonfictionSix.push(nonfictionBests[i])
            }
            return nonfictionSix.map((each) => 
                <Col key={each.primary_isbn13} xs={6} md={3} lg={2} className="bestsellers" >
                    <img src={each.book_image} alt={each.title} />
                    <p><strong><em>{each.title}</em></strong></p>
                    <p>By <strong>{each.author}</strong></p>
                    <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                    <div className="summary-reading">
                        {each.description && each.description !== 'null' ? 
                                    <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            Summary
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="1">
                                                        <Card.Body><p>{each.description}</p></Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                    </Accordion>  
                                    : 
                                <p>(No summary available)</p> }
                </div>
                </Col>
            )
        }
    }
    renderRestBestSellersnonFiction(){
        let nonfictionBests = this.state.nytnonFiction;
        let nonfictionRest = [];
        if(nonfictionBests.length>0){
            for(let i=6;i<15;i++){
                nonfictionRest.push(nonfictionBests[i])
            }
            return nonfictionRest.map((each) => 
                <Col key={each.primary_isbn13} xs={6} md={3} lg={2} className="bestsellers" >
                    <img src={each.book_image} alt={each.title} />
                    <p><strong><em>{each.title}</em></strong></p>
                    <p>By <strong>{each.author}</strong></p>
                    <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                    <div className="summary-reading">
                        {each.description && each.description !== 'null' ? 
                                    <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            Summary
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="1">
                                                        <Card.Body><p>{each.description}</p></Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                    </Accordion>  
                                    : 
                                <p>(No summary available)</p> }
                </div>
                </Col>
            )
        }
    }
    renderRestBestSellersFiction(){
        let fictionBests = this.state.nytFiction;
        let fictionRest = [];
        if(fictionBests.length>0){
            for(let i=6;i<15;i++){
                fictionRest.push(fictionBests[i])
            }
            return fictionRest.map((each) => 
                <Col key={each.primary_isbn13} xs={6} md={3} lg={2} className="bestsellers" >
                    <img src={each.book_image} alt={each.title} />
                    <p><strong><em>{each.title}</em></strong></p>
                    <p>By <strong>{each.author}</strong></p>
                    <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                    <div className="summary-reading">
                        {each.description && each.description !== 'null' ? 
                                    <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            Summary
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="1">
                                                        <Card.Body><p>{each.description}</p></Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                    </Accordion>  
                                    : 
                                <p>(No summary available)</p> }
                </div>
                </Col>
            )
        }
    }
    render(){
        const { nytFiction, nytnonFiction } = this.state;
        
        return(
          <div>
                {nytFiction && nytnonFiction &&
                    <div>
                        <h3>Current bestsellers: non-fiction</h3>
                        <Row>
                        {this.renderBestSellersnonFiction()}
                        </Row>
                        <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            View more...
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="1">
                                                        <Card.Body>
                                                            <Row>
                                                                {this.renderRestBestSellersnonFiction()}
                                                            </Row>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                        </Accordion>  
                        <h3>Current bestsellers: fiction</h3>
                        <Row>
                        {this.renderBestSellersFiction()}
                        </Row>
                        <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            View more...
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="1">
                                                        <Card.Body>
                                                            <Row>
                                                                {this.renderRestBestSellersFiction()}
                                                            </Row>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                        </Accordion>  
                    </div>
                }
           </div>
        )
    }
}

export default Bestsellers;