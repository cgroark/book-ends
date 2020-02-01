import React from 'react';
import { Row, Col, Accordion, Card, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";


class BookForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            allData: [],
            submitting: false,
            author: '', 
            title: '', 
            status: '', 
            rating: '',
            bookid: '',
            editing: false,
            adding: false,
            form: false,
            currentID: '',
            date: '',
            checking: false,
            query: '',
            searchData: [],
            searchComplete: false,
            searchForm: false,
            searchError: false,
            books: true
        }

    }
    componentDidMount =() => {
        let usernameProps = this.props.name;
        let usernameData = localStorage.getItem('username');
        console.log('props:', usernameProps, ' localstorage: ', usernameData)
        if(usernameProps){
            this.setState({
                savedusername: usernameProps,
                checkusername: true,
                username: usernameProps
            })
            this.getAllData();
        }
        else if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true,
                username: usernameData
            })
            this.getAllData();
        }
        // this.setState({username: this.props.name});
        
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
                console.log('data', this.state.allData)
            }).then( () => {
                let userData = this.state.allData.filter(one => one.username === this.state.username);
                if(userData.length === 0){
                    this.setState({currentID: 1});
                }else{
                    let allIDs =[];
                    for(var b=0 ; b<userData.length ; b++){
                        allIDs.push(parseInt(userData[b].id.split('id=')[1]));
                    }
                    let newID = allIDs.sort()[allIDs.length -1] + 1;
                    this.setState({currentID: newID})
                }       
            })
    }
    handleSearch = (e) =>{
        e.preventDefault()
        console.log('query', this.state.query);
        this.setState({
            searchError: false
        })
        fetch('https://www.googleapis.com/books/v1/volumes?q="'+this.state.query+'"')
        .then( response =>  response.json())
        .then( (json) => {
            if(json.totalItems > 0){
                this.setState({
                    searchData: json, 
                    searchComplete: true
                })
            }else{
                this.setState({
                    query: '',
                    searchError: true
                })
                return json;
            }
           
        })
    }
    showSearchForm = () =>{
        this.setState({
            books: false,
            adding: true,
            searchForm: true,
            author: '', 
            title: '', 
            status: 'select-status', 
            date: '',
            editing: false,
            form: false
        })
    }
    addSearchResults = (title, author, e) => {
        e.preventDefault();
        console.log("clicked", title, author)
        this.setState({
            searchComplete: false,
            searchForm: false,
            query: '',
            adding: true,
            form: true,
            title: title,
            author: author[0]
        })
    }
    searchAgain = () => {
        this.setState({
            searchForm: true,
            searchComplete: false,
            query: ''
        })
    }
    showAddForm = () =>{
        this.setState({
            adding: true,
            searchComplete: false,
            searchForm: false,
            form: true
        })
    }
    handleSubmit = event => {
        const dataSend = {
            date: this.state.date,
            author: this.state.author,
            username: this.state.username,
            title: this.state.title,
            status: this.state.status,
            id: this.state.username+'id='+this.state.currentID,
            rating: this.state.rating
        }
        console.log(dataSend)
        event.preventDefault()
        this.setState({
            submitting: true
        })
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(dataSend)
        }).then( (response) => {
            console.log(response)
            this.setState({
                submitting: false,
                author: '', 
                title: '', 
                status: 'select-status', 
                date: '',
                rating: '',
                adding: false,
                form: false,
                books: true
            })
            console.log('done with book');
            this.getAllData();
            return response.json()  
        });
    }
    updateBook = (each, e) =>{
        this.setState({
            books: false,
            editing: true,
            form: true
        })
        console.log('date here', each.date)
        this.setState({
            author: each.author,
            title: each.title, 
            status: each.status, 
            rating: each.rating,
            bookid: each.id
        })
    }
    handleSubmitEdit = event => {
        const dataEdit = {
            author: this.state.author,
            title: this.state.title,
            rating: this.state.rating,
            status: this.state.status,
            date: this.state.date
        }
        console.log(dataEdit)
        event.preventDefault()
        this.setState({
            submitting: true
        })
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351/id/'+this.state.bookid, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(dataEdit)
        }).then( (response) => {
            console.log(response)
            this.setState({
                submitting: false,
                author: '', 
                title: '', 
                status: 'select-status', 
                date: '',
                editing: false,
                form: false
            })
        }).then( () =>{
            console.log('done with book edit')
            setTimeout(() =>{
                    this.getAllData();
                    this.setState({books: true})
            }, 1000);
        })
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    handleDateChange = date => {
        this.setState({date: date})
    }
    updateStatus = e => {
        console.log(e.target.value)
        this.setState({
            status: e.target.value
        })
    }
    updateRating = (e) => {
        console.log(e.target.value)
        this.setState({
            rating: e.target.value
        })
    }
    checkDelete = (e)=> {
        e.preventDefault();
        console.log('checking')
        this.setState({checking: true})
    }    
    handleDeleteYes = (e) =>{
        e.preventDefault();
        console.log('delete', this.state.bookid, this.state.title)
        this.setState({
            submitting: true
        })
        fetch("https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351/id/"+this.state.bookid, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'  
        }).then( (response) => {
            console.log(response)
            this.setState({
                submitting: false
            });
            this.setState({checking: false, editing: false, form: false, books:true})
            console.log('done with book delete')
            setTimeout(() =>{
                    this.getAllData();
            }, 1000);
        });
       
    }
    handleDeleteNo = () => {
        this.setState({checking: false})
    }
    removeForm = () => {
        this.setState({
            searchForm: false,
            form: false,
            books: true,
            searchComplete: false,
            query: '',
            adding: false,
            author: '',
            title: '', 
            status: 'select-status', 
            date: '',
            rating: '',
        })
    }
    renderSearchData(){
        let submitting = this.state.submitting;
        let bookData = this.state.searchData;
        console.log(bookData, bookData.items.length)
        let currentBooks = [];
        for(var b=0; b < bookData.items.length; b++){
            let activeBook = bookData.items[b].volumeInfo
            currentBooks.push(
            <Col key={bookData.items[b].id} md={6}>
            <div className="eachbook">
                    <p><strong>{activeBook.title}<em>{activeBook.subtitle ? ', '+activeBook.subtitle : '' }</em></strong></p>
                    <p>{activeBook.authors}</p>
                    <img src={activeBook.imageLinks.thumbnail} alt={activeBook.title}/>
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Overview (see details)
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body><p>{bookData.items[b].volumeInfo.description}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>    
                    <input type='submit' className="add-button search" disabled={submitting} onClick={(e) =>this.addSearchResults(activeBook.title, activeBook.authors, e)} value={submitting ? 'Loading...' : 'Add '+activeBook.title}></input>
            </div>
            </Col>
            )
        }
        return currentBooks;
    }
    renderReading(){
        return this.state.allData.filter(book => book.username === this.state.username && book.status === "Currently-Reading").map((each) => 
        <span key={each.id}>{each.title}</span>
        )
    }
    renderAllData(){
        return this.state.allData.filter(one => one.username === this.state.username && one.title).map((each) => 
            <tr key={each.id}><td>{each.title}</td><td>{each.author}</td><td>{each.status}</td><td>{moment(each.date).isValid() ? moment(each.date).format('MM/DD/YYYY'): ""}</td><td>{each.rating}</td>
            <td>
            {!this.state.form &&
               <div>
                <label htmlFor="edit"></label>
                 <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
               </div>
            }
            </td>
            
            </tr>
        )
    }
    render(){
    const { submitting, author, title, status, allData, date, query, editing, searchComplete, searchError, searchForm, form, books} = this.state;
    const allBooks = allData.filter(book => book.username === this.state.username)
    const bookCount = allData.filter(book => book.username === this.state.username).length;
        return(
            <div className="main-body">
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 &&
                    <div>
                        <h3> <i className="fa fa-book" aria-hidden="true"></i>&nbsp;Currently Reading: {this.renderReading()}</h3>
                            <hr />
                    </div>
                }
                {!books &&
                    <div id="close-form"><button  onClick={this.removeForm}>x</button></div>
                }
                {!editing && !form && !searchForm &&
                    <input type='submit' className="add-button" value="Find a book" onClick={this.showSearchForm}></input>
                }
                {searchError &&
                        <div>
                           <p><strong>Looks like we can't find that book. Search again below!</strong></p>
                        </div>
                }
                {!searchComplete && searchForm &&
                    <div>
                        <form onSubmit={this.handleSearch} className={submitting ? 'loading' : 'search-form'}>
                            <input placeholder="Search for books by title..." type="text" name='query' value={query} onChange={this.handleChange} />
                            <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Search'}></input>
                        </form>
                    </div>
                   
                }
              
                {searchComplete &&
                    <div id="search-results">
                         <h3>Found these books:</h3>
                         <Row>
                        {this.renderSearchData()}
                        </Row>
                            <input  type='submit' className="add-button" onClick={this.searchAgain} disabled={submitting} value={submitting ? 'Loading...' : 'Search again'}></input>
                            <input className="nevermind" type='submit'  onClick={this.showAddForm} disabled={submitting} value={submitting ? 'Loading...' : 'Manually enter a book'}></input>
                    </div>
                }

                {this.state.form &&
                    <div>
                    <form onSubmit={this.state.adding ? this.handleSubmit : this.handleSubmitEdit} className={submitting ? 'loading' : 'submit-form'}>
        
                        <Row>
                            <Col md={4}>
                                <label >Title:<br />
                                    <input type="text" name='title' value={title} onChange={this.handleChange} />
                                </label>
                            </Col>
                            <Col md={8}>
                                <label >Author:<br />
                                    <input type="text" name='author' value={author} onChange={this.handleChange} /> 
                                </label>
                            </Col>
                        </Row>
                        <Row>
                    
                            <Col md={4}>
                                <label>Status: <br />
                                    <select defaultValue={"select-status"} onChange={this.updateStatus}>>
                                        <option value="select-status" disabled>Select status</option>
                                        <option value="Finished">Finished</option>
                                        <option value="Currently-Reading">Currently reading</option>
                                        <option value="Want-to-read">Want to read</option>
                                    </select>
                                </label>
                            </Col>
                            {status === "Finished" &&
                            <React.Fragment>
                            <Col md={4}>
                                <label>Recommendation: <br />
                                    <select defaultValue={"select-rating"} onChange={this.updateRating}>>
                                        <option value="select-rating" disabled>Select rating</option>
                                        <option value="Highly Recommend">Highly recommend</option>
                                        <option value="Recommend">Recommend</option>
                                        <option value="Do-not-Recommend">Don't recommend</option>
                                        <option value="Do-not-read">Please do not read</option>
                                    </select>
                                </label>
                            </Col>
                            <Col md={4}>
                                <label >Date finished:<br />
                                <DatePicker selected={date} onChange={this.handleDateChange} />
                                </label>
                            </Col>
                            </React.Fragment>
                            }
                            
                        </Row>
                        <div>
                            <div id="input-section">
                                <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Submit'}></input>
                                {this.state.editing && this.state.form &&
                                <input id="delete" type='submit' onClick={this.checkDelete} disabled={submitting} value={submitting ? 'Loading...' : 'Delete book'}></input>
                                }
                            </div>
                            {this.state.checking &&
                            <div id="delete-section">
                                <div className={submitting ? 'load-delete' : 'check-delete'}>
                                    <h3>Are you sure you want to delete {title} from your list?</h3>
                                    <label htmlFor="delete-all"></label>
                                    <input className="delete-button" type="submit" value="Yes" id="delete-all" onClick={this.handleDeleteYes}></input>
                                    <label htmlFor="delete-all-no"></label>
                                    <input className="delete-button-no" type="submit" value="No" id="delete-all-no" onClick={this.handleDeleteNo}></input>
                                </div>
                            </div>
                            }
                        </div>
                    </form>   
                    </div>
                }
                {books && bookCount > 1 &&
                    <table className="book-table">
                        <thead>
                            <tr>
                                <th>Book title</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Date finished</th>
                                <th>Rating</th>
                                {!this.state.form &&
                                    <th>&nbsp;</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderAllData()}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export default BookForm;

