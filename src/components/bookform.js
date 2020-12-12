import React from 'react';
import { Row, Col, Accordion, Card, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Scrollspy from 'react-scrollspy';
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
            test: '',
            status: '', 
            format: '',
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
            searchloading: true,
            currentlyReading: true,
            searchButton: false,
            googleAPIData: [],
            sortedData : [],
            firstName: '',
            lastName: '',
            requiredStatus: false,
            requiredAuthor: false,
            requiredTitle: false
        }

    }
    componentDidMount =() => {
        let usernameProps = this.props.name;
        let usernameData = localStorage.getItem('username');
        if(usernameProps){
            this.setState({
                savedusername: usernameProps,
                checkusername: true,
                username: usernameProps
            })
            // this.getAllData();
            this.getGoogleAPI();
            
        }
        else if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true,
                username: usernameData
            })
            // this.getAllData();
            this.getGoogleAPI();
        }
        // this.setState({username: this.props.name});
        
    }
    sortData = () =>{
        const allDataSorted = [];
        const firstName = this.state.googleAPIData.filter(firstName => firstName.gs$cell.col === "1");
        const lastName = this.state.googleAPIData.filter(lastName => lastName.gs$cell.col ==="2");
        const username = this.state.googleAPIData.filter(username => username.gs$cell.col ==="3");
        const id = this.state.googleAPIData.filter(id => id.gs$cell.col ==="4");
        const title = this.state.googleAPIData.filter(title => title.gs$cell.col ==="5");
        const author = this.state.googleAPIData.filter(author => author.gs$cell.col ==="6");
        const date = this.state.googleAPIData.filter(date => date.gs$cell.col ==="7");
        const status = this.state.googleAPIData.filter(status => status.gs$cell.col ==="8");
        const rating = this.state.googleAPIData.filter(rating => rating.gs$cell.col ==="9");
        const overview = this.state.googleAPIData.filter(overview => overview.gs$cell.col ==="10");
        const image = this.state.googleAPIData.filter(image => image.gs$cell.col ==="11"); 
        const format = this.state.googleAPIData.filter(format => format.gs$cell.col ==="12");
        for(let i=0; i<firstName.length; i++){
            allDataSorted.push({
                firstName: firstName[i].content.$t,              
                lastName: lastName[i].content.$t,               
                username: username[i].content.$t,              
                id: id[i].content.$t,               
                title: title[i].content.$t,               
                author: author[i].content.$t,              
                date: date[i].content.$t,               
                status: status[i].content.$t,              
                rating: rating[i].content.$t,              
                overview: overview[i].content.$t,              
                image: image[i].content.$t,               
                format: format[i].content.$t   
            })
        }
        this.setState({
            sortedData: allDataSorted
        });
    }
    getGoogleAPI = () => {
        fetch('https://spreadsheets.google.com/feeds/cells/1HhGhrqm2vagTS5wKxNYp7rh89en4ZVNkLfPd4DYCcrI/1/public/full?alt=json')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    googleAPIData: json.feed.entry
                });
                this.sortData();
            }).then( () => {
                let userData = this.state.sortedData.filter(one => one.username === this.state.username);
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
                }       
            }).then( () => {
                this.setState({
                    searchloading: false,
                    searchButton: true
                });
            })
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
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
                } 
            }).then( () => {
                this.setState({
                    searchloading: false,
                    searchButton: true
                });
            })
    }
    handleSearch = (e) =>{
        e.preventDefault()
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
            format: 'select-format', 
            rating: 'select-rating', 
            date: ''
        })
    }
    addSearchResults = (title, author, description, image, e) => {
        var currentDate = moment().toDate();
        // var newImage = 'https'+ image.slice(4);
        e.preventDefault();
        this.setState({
            searchComplete: false,
            searchForm: false,
            query: '',
            adding: true,
            form: true,
            title: title,
            author: author[0],
            description: description, 
            imageUrl: image,
            rating: 'select-rating',
            date: currentDate
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
        if(this.state.imageUrl === ''){
            event.preventDefault()
            this.setState({
                imageUrl: 'null'
            })
        }
        if(this.state.description === ''){
            event.preventDefault()
            this.setState({
                description: 'null'
            })
        }
        if(this.state.date === ''){
            event.preventDefault()
            this.setState({
                date: moment().toDate()
            })
        }
        if(this.state.status === 'select-status' || this.state.title === '' || this.state.author === '' ){
            event.preventDefault()
            if(this.state.status === 'select-status'){
                this.setState({
                    requiredStatus: true
                })
            }
            if(this.state.title === ''){
                this.setState({
                    requiredTitle: true
                })
            }
            if(this.state.author === ''){
                this.setState({
                    requiredAuthor: true
                })
            }
            
        } else{
            const dataSend = {
                firstName: 'null',
                lastName: 'null',
                date: this.state.date,
                author: this.state.author,
                username: this.state.username,
                title: this.state.title,
                status: this.state.status,
                format: this.state.format,
                id: this.state.username+'id='+this.state.currentID,
                rating: this.state.rating,
                overview: this.state.description,
                image: this.state.imageUrl,
                friends: 'null'
             }
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
            this.setState({
                searchloading: false,
                author: '', 
                title: '', 
                status: 'select-status', 
                format: 'select-format', 
                rating: 'select-rating', 
                date: '',
                description: '',
                imageUrl: '',
                adding: false,
                books: true, 
                editing: false,
                currentlyReading: true,
                searchButton: true
            })
            this.getGoogleAPI();
            return response.json()  
        });
    }
    }
    updateBook = (each, e) =>{  
        var updateRating = each.rating === 'select-rating' ? 'select-rating' : each.rating;
        var dateUpdating = each.status === 'Finished' ? moment(each.date).toDate() : moment().toDate();
        console.log('updating ' + each.title + ' with status of '+ each.status + 'to date of ' + dateUpdating)
        this.setState({
            books: false,
            currentlyReading: false,
            editing: true,
            form: true,
            searchButton: false
        })
        this.setState({
            date: dateUpdating,
            author: each.author,
            title: each.title, 
            status: each.status, 
            format: each.format,
            rating: updateRating,
            bookid: each.id
            
        })
    }
    handleSubmitEdit = event => {
        const dataEdit = {
            author: this.state.author,
            title: this.state.title,
            rating: this.state.rating,
            status: this.state.status,
            format: this.state.format,
            date: this.state.date
        }
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
            this.setState({
                author: '', 
                title: '', 
                status: 'select-status', 
                format: 'select-format', 
                rating: 'select-rating', 
                date: '',
                editing: false
            })
        }).then( () =>{
            this.getGoogleAPI();
            this.setState({
                books: true,
                searchloading: false,
                currentlyReading: true,
                searchButton: true
            })
        })
    }
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if(this.state.status !== 'select-status'){
            this.setState({
                requiredStatus: false
            })
        }
        if(this.state.title !== ''){
            this.setState({
                requiredTitle: false
            })
        }
        if(this.state.author !== ''){
            this.setState({
                requiredAuthor: false
            })
        }
    }
    handleDateChange = date => {
        this.setState({date: date})
    }
    updateStatus = e => {
        this.setState({
            status: e.target.value,
            required: false
        })
    }
    updateTest = e => {
        this.setState({
            test: e.target.value,
        })
    }
    updateFormat = e => {
        this.setState({
            format: e.target.value
        })
    }
    updateRating = (e) => {
        this.setState({
            rating: e.target.value
        })
    }
    checkDelete = (e)=> {
        e.preventDefault();
        this.setState({
            checking: true
        })
    }    
    handleDeleteYes = (e) =>{
        e.preventDefault();
        this.setState({
            searchloading: true,
            checking: false,
            form: false,
            editing: false
        })
        fetch("https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351/id/"+this.state.bookid, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'  
        }).then( (response) => {
            setTimeout(() =>{
                    this.getGoogleAPI();
                    this.setState({
                        searchloading: false,
                        books:true, 
                        searchButton: true,
                        currentlyReading: true
                    })
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
            format: 'select-format', 
            rating: 'select-rating', 
            date: '',
            editing: false,
            currentlyReading: true,
            searchButton: true,
            checking: false,
            required: false
        })
    }
    renderSearchData(){
        let submitting = this.state.submitting;
        let bookData = this.state.searchData;
        let currentBooks = [];
        for(var b=0; b < bookData.items.length; b++){
            let activeBook = bookData.items[b].volumeInfo;
            let image;
            activeBook.imageLinks ? image = 'https'+ activeBook.imageLinks.thumbnail.slice(4) : image = '';
            currentBooks.push(
            <Col key={bookData.items[b].id} sm={6}>
            <div className="eachbook">
                <Row>
                    <Col  xs={7}>
                        <p><strong>{activeBook.title}<em>{activeBook.subtitle ? ', '+activeBook.subtitle : '' }</em></strong></p>
                        <p>{activeBook.authors}</p>
                       
                    </Col>
                    <Col  xs={5}>
                        <p>{activeBook.imageLinks ? <img src={image} alt={activeBook.title} /> : '' }</p>
                        
                    </Col>  
                    
                        <Col  xs={12}>
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
                        </Col>
                   
                        <input type='submit' className="add-button search" disabled={submitting} onClick={(e) =>this.addSearchResults(activeBook.title, activeBook.authors, activeBook.description, image, e)} value={submitting ? 'Loading...' : 'Add '+activeBook.title}></input>
                 </Row>
            </div>
            </Col>
            )
        }
        return currentBooks;
    }
    renderReading(){
        return this.state.sortedData.filter(book => book.username === this.state.username && book.status === "Currently-Reading").map((each) => 
          <Col sm={6} key={each.id}  >
             
              <Row>
                <Col  xs={7}>
                <div>
                    <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3> 
                </div>
                <div >
                    <h4>{each.author}</h4>
                </div>
                    {!this.state.form &&
                        <div>
                            <label htmlFor="edit"></label>
                            <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                        </div>
                    }
                    
                </Col>
                <Col xs={5}>
                    <span>{each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                            }
                    </span>
                </Col>
                </Row>
                <div className="summary-reading">
                        {each.overview && each.overview !== 'null' ? 
                                    <Accordion defaultActiveKey="0">
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            Summary
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
        )
    }
    renderFinishedData(){
        return this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished").sort((a,b) => new moment(a.date) - new moment(b.date)).map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                            <p className="card-smaller">{each.rating === 'select-rating' ? '' : each.rating} </p>
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
                        </Col>
                        <Col xs={4}>
                            {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                            }
                            
                        </Col>
                        
                    </Row>
                    {each.overview && each.overview !== 'null' ? 
                        <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                Summary
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
        return this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Want-to-read").map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
                        </Col>
                        <Col xs={4}>
                            {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                            }
                            
                        </Col>
                        
                    </Row>
                    {each.overview && each.overview !== 'null' ? 
                        <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                Summary
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
    const { format, checking, submitting, author, title, status, sortedData, date, query, rating, searchComplete, searchError, searchForm, searchloading, form, books, currentlyReading, searchButton} = this.state;
    const allBooks = sortedData.filter(book => book.username === this.state.username)
    const bookCount = sortedData.filter(book => book.username === this.state.username).length;
    
        return(
            <div className="main-body">
                {searchButton &&
                <div>
                    <h1>Your books</h1>
                    <p>Track your recent reads and search for new books below.</p>
                </div>
                }
                {searchButton &&
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
                }
                {searchButton && 
                    <div>
                        <input type='submit' className="add-button" value="Find a book" onClick={this.showSearchForm}></input>
                    
                    </div>
                }
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 && currentlyReading && 
                    <div id="currently-reading">
                     <h2>Currently reading</h2>
                     <Row  className='reading-now'>
                      {this.renderReading()}
                    </Row>
                    </div>
                }
              
                {searchloading && 
                    <div className="progress-infinite">
                        <div className="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {!books && !searchloading && !form &&
                    <div>
                        {!searchComplete &&
                         <div>
                             <h2>Search for books below</h2>
                            <p>Find books and add them to your booklist</p>
                        </div>
                        }
                        
                        <div id="close-button"><button  onClick={this.removeForm}>x</button>
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
                         <div className="search-bar">
                             <input  type='submit' onClick={this.searchAgain}  value='Search again'></input>
                            <input  type='submit'  onClick={this.removeForm}  value='Back to my books'></input>
                         </div>
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
                                {this.state.requiredTitle &&
                                        <span className="required">This is required</span>
                                    }
                                    <input type="text" name='title' value={title} onChange={this.handleChange} />
                                </label>
                            </Col>
                            <Col md={4}>
                                <label >Author:<br />
                                {this.state.requiredAuthor &&
                                        <span className="required">This is required</span>
                                    }
                                    <input type="text" name='author' value={author} onChange={this.handleChange} /> 
                                </label>
                            </Col>
                            <Col md={4}>
                                    <label>Format: <br />
                                    <select defaultValue={format} onChange={this.updateFormat}>
                                        <option value="select-format" disabled>Select format</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Text">Text</option>
                                    </select>
                                </label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <label>Status*:  <br />
                                    {this.state.requiredStatus &&
                                        <span className="required">This is required</span>
                                    }
                                    <select required defaultValue={status} onChange={this.updateStatus}>
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
                                    <select defaultValue={rating} onChange={this.updateRating}>
                                        <option value="select-rating" disabled>Select rating</option>
                                        <option value="Highly Recommend">Highly recommend</option>
                                        <option value="Recommend">Recommend</option>
                                        <option value="Do Not Recommend">Don't recommend</option>
                                        <option value="Do Not Read">Please do not read</option>
                                    </select>
                                </label>
                            </Col>
                            <Col md={4}>
                                <label >Finished on:</label><br />
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
                                    <input className="delete check" type="submit" value="Yes" id="delete-yes" onClick={this.handleDeleteYes}></input>
                                    <label htmlFor="delete-no"></label>
                                    <input className="delete check" type="submit" value="No" id="delete-no" onClick={this.handleDeleteNo}></input>
                                </div>
                            </div>
                            }
                        
                    </form>   
                    </div>
                }
                {books && bookCount > 1 &&
                    
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
                            <h2 >Books I want to read</h2>
                            <Row>
                                {this.renderWantData()}
                            </Row>
                        </div>
                     }
                    
                    </div>
                }
            </div>
        )
    }
}

export default BookForm;

