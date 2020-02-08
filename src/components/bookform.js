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
            books: true,
            description: '',
            imageUrl: '',
            searchloading: false,
            currentlyReading: true,
            searchButton: true
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
                    let sortedIDs= allIDs.sort((b, a) => b - a)
                    let newID = sortedIDs[allIDs.length -1] + 1;
                    this.setState({currentID: newID})
                    console.log('the current id is', this.state.currentID)
                }       
            })
    }
    handleSearch = (e) =>{
        e.preventDefault()
        console.log('query', this.state.query);
        this.setState({
            searchloading: true,
            searchError: false,
            searchForm: false
        })
        fetch('https://www.googleapis.com/books/v1/volumes?q="'+this.state.query+'"')
        .then( response =>  response.json())
        .then( (json) => {
            if(json.totalItems > 0){
                this.setState({
                    searchData: json, 
                    searchComplete: true,
                    searchloading: false
                })
            }else{
                this.setState({
                    query: '',
                    searchError: true,
                    searchForm: true,
                    searchloading: false
                })
                return json;
            }
           
        })
    }
    showSearchForm = () =>{
        this.setState({
            currentlyReading: false,
            searchButton: false,
            books: false,
            searchForm: true,
            author: '', 
            title: '', 
            status: 'select-status', 
            date: ''
        })
    }
    addSearchResults = (title, author, description, image, e) => {
        e.preventDefault();
        console.log("clicked", title, author, image)
        this.setState({
            searchComplete: false,
            searchForm: false,
            query: '',
            adding: true,
            form: true,
            title: title,
            author: author[0],
            description: description, 
            imageUrl: image
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
            rating: this.state.rating,
            overview: this.state.description,
            image: this.state.imageUrl
        }
        console.log(dataSend)
        event.preventDefault()
        this.setState({
            searchloading: true,
            form: false,
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
                searchloading: false,
                author: '', 
                title: '', 
                status: 'select-status', 
                date: '',
                rating: '',
                description: '',
                imageUrl: '',
                adding: false,
                books: true, 
                editing: false,
                currentlyReading: true,
                searchButton: true
            })
            console.log('done with book');
            this.getAllData();
            return response.json()  
        });
    }
    updateBook = (each, e) =>{
        this.setState({
            books: false,
            currentlyReading: false,
            editing: true,
            form: true,
            searchButton: false
        })
        console.log('data here', each.date, moment(each.date).format('MM/DD/YYYY'))
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
            searchloading: true,
            form: false
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
                author: '', 
                title: '', 
                status: 'select-status', 
                date: '',
                editing: false
            })
        }).then( () =>{
            console.log('done with book edit')
            setTimeout(() =>{
                    this.getAllData();
                    this.setState({
                        books: true,
                        searchloading: false,
                        currentlyReading: true
                    })
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
        this.setState({
            checking: true
        })
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
            editing: false,
            currentlyReading: true,
            searchButton: true
        })
    }
    renderSearchData(){
        let submitting = this.state.submitting;
        let bookData = this.state.searchData;
        console.log('alldata', bookData, bookData.items.length)
        console.log('first book', bookData.items[0].volumeInfo)
        let currentBooks = [];
        for(var b=0; b < bookData.items.length; b++){
            let activeBook = bookData.items[b].volumeInfo;
            let image;
            activeBook.imageLinks ? image = activeBook.imageLinks.thumbnail : image = '';
            currentBooks.push(
            <Col key={bookData.items[b].id} md={6}>
            <div className="eachbook">
                    <p><strong>{activeBook.title}<em>{activeBook.subtitle ? ', '+activeBook.subtitle : '' }</em></strong></p>
                    <p>{activeBook.authors}</p>
                    <p>{activeBook.imageLinks ? <img src={image} alt={activeBook.title} /> : '' }</p>
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Overview (see details)
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body><p>{activeBook.description}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>    
                    <input type='submit' className="add-button search" disabled={submitting} onClick={(e) =>this.addSearchResults(activeBook.title, activeBook.authors, activeBook.description, image, e)} value={submitting ? 'Loading...' : 'Add '+activeBook.title}></input>
            </div>
            </Col>
            )
        }
        return currentBooks;
    }
    renderReading(){
        return this.state.allData.filter(book => book.username === this.state.username && book.status === "Currently-Reading").map((each) => 
        <div key={each.id} id="reading-now">
            <h3  >Currently reading:<br />
            <em>{each.title}</em></h3> 
            <span>{each.image ? <img src={each.image} alt={each.title} />  :''}</span>
        </div>
        )
    }
    renderAllData(){
        return this.state.allData.filter(one => one.username === this.state.username && one.title).map((each) => 
            <tr key={each.id}><td className="title-cell">
            <div>
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
            </td><td>{each.author}</td><td>{each.status}</td><td>{moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""}</td><td>{each.rating}</td>
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
    const { checking, submitting, author, title, status, allData, date, query, editing, rating, searchComplete, searchError, searchForm, searchloading, form, books, currentlyReading, searchButton} = this.state;
    const allBooks = allData.filter(book => book.username === this.state.username)
    const bookCount = allData.filter(book => book.username === this.state.username).length;
    console.log('date', date)
        return(
            <div className="main-body">
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 && currentlyReading &&
                    <div>
                      {this.renderReading()}
                            <hr />
                    </div>
                }
                {!books && !searchloading && !form &&
                    <div id="close-button"><button  onClick={this.removeForm}>x</button></div>
                }
                {searchButton && 
                    <input type='submit' className="add-button" value="Find a book" onClick={this.showSearchForm}></input>
                }
                {searchloading && 
                    <div class="progress-infinite">
                        <div class="progress-bar3" >
                        </div>                       
                    </div> 
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
                            <input type='submit' value="Search"></input>
                        </form>
                        <input className="manual" type='submit'  onClick={this.showAddForm} disabled={submitting} value='Manually enter a book'></input>
                    </div>
                   
                }
              
                {searchComplete &&
                    <div id="search-results">
                         <h3>Found these books:</h3>
                         <input  type='submit' className="add-button" onClick={this.searchAgain}  value='Search again'></input>
                         <Row>
                        {this.renderSearchData()}
                        </Row>
                    </div>
                }

                {form && 
                    <div>
                    <form onSubmit={this.state.adding ? this.handleSubmit : this.handleSubmitEdit} className='submit-form'>
                    <div id="close-form"><button  onClick={this.removeForm}>x</button></div>
                        {!checking &&
                        <div>
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
                                    <select defaultValue={status} onChange={this.updateStatus}>>
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
                                    <select defaultValue={editing ? rating : "select-rating"} onChange={this.updateRating}>>
                                        <option value="select-rating" disabled>Select rating</option>
                                        <option value="Highly Recommend">Highly recommend</option>
                                        <option value="Recommend">Recommend</option>
                                        <option value="Do-not-Recommend">Don't recommend</option>
                                        <option value="Do-not-read">Please do not read</option>
                                    </select>
                                </label>
                            </Col>
                            <Col md={4}>
                                <label >Finished on:</label>
                                <DatePicker selected={date} onChange={this.handleDateChange}  />                                
                            </Col>
                            </React.Fragment>
                            }
                            
                        </Row>
                        </div>
                        }
                         {!checking &&
                            <div id="input-section">
                                <input type='submit'  value={this.state.adding ? 'Add Book' : 'Update Book'}></input>
                                {this.state.editing && this.state.form &&
                                    <input className="delete" type='submit' onClick={this.checkDelete} value='Delete book'></input>
                                }
                            </div>
                         }
                            {checking &&
                            <div id="delete-section">
                                <div>
                                    <h3>Are you sure you want to delete {title} from your list?</h3>
                                    <label htmlFor="delete-yes"></label>
                                    <input className="delete" type="submit" value="Yes" id="delete-yes" onClick={this.handleDeleteYes}></input>
                                    <label htmlFor="delete-no"></label>
                                    <input className="delete" type="submit" value="No" id="delete-no" onClick={this.handleDeleteNo}></input>
                                </div>
                            </div>
                            }
                        
                    </form>   
                    </div>
                }
                {books && bookCount > 1 &&
                    
                    <div id="booklist"><h2>Your book list</h2>
                    <table className="book-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>&nbsp;</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Completed</th>
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
                    </div>
                }
            </div>
        )
    }
}

export default BookForm;

