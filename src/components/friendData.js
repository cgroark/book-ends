import React from 'react';
import moment from 'moment';
import {Accordion, Card, Button } from 'react-bootstrap';



class FriendData extends React.Component {
    constructor(props){
        super(props);
        this.state={
           friendData: [],
           searchloading: true,
        }

    }
    componentDidMount =() => {
        this.setState({
            friendData: this.props.data,
            searchloading: false
        })
        console.log('new component', this.props.data)
    }
    
    renderReading(){
        return this.state.friendData.filter(book => book.status === "Currently-Reading").map((each) => 
        <div id="reading-now">
            <h3  key={each.id}>Currently reading:<br />
            <em>{each.title}</em></h3> 
            <span>{each.image ? <img src={each.image} alt={each.title} />  :''}</span>
        </div>
        )
    }
    renderAllData(){
        return this.state.friendData.map((each, index) => 
        <tr key={each.id}><td className="title-cell">
            <div key={each.id}>
            {each.title} 
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
            : <p>(No summary available)</p> }
            </div>
         </td>
         <td> {each.image ?
            <img src={each.image} alt={each.title} />
        :
        ''
        }
        </td><td>{each.author}</td><td>{each.status}</td><td>{moment(each.date).isValid() ? moment(each.date).format('MM/DD/YYYY'): ""}</td><td>{each.rating}</td>
            </tr>
        )
    }
    render(){
    const { friendData, searchloading} = this.state;
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
                    <h3> {this.renderReading()}</h3>
                        <hr />
                </div>
                }
                <table className="book-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>&nbsp;</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Completed</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.renderAllData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default FriendData;

