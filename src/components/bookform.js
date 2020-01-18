import React from 'react';
import { Row, Col } from 'react-bootstrap';


class BookForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            allData: [],
            submitting: false,
            authorfirst: '', 
            authorlast: '', 
            title: '', 
            status: '', 
            rating: '',
            datedone: '',
            bookid: '',
            editing: false,
            adding: false,
            form: false,
            currentID: ''
        }

    }
    componentDidMount =() => {
        this.setState({username: this.props.username});
        this.getAllData();
    }
    getAllData = () => {
        console.log('reached')
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
                if(userData.length == 0){
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
    showAddForm = () =>{
        this.setState({
            adding: true,
            form: true
        })
    }
    handleSubmit = event => {
        const dataSend = {
            authorfirst: this.state.authorfirst,
            authorlast: this.state.authorlast,
            username: this.state.username,
            title: this.state.title,
            status: this.state.status,
            id: this.state.username+'?id='+this.state.currentID,
            datedone: this.state.datedone,
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
            this.setState({
                submitting: false,
                authorfirst: '', 
                authorlast: '', 
                title: '', 
                status: 'select-status', 
                datedone: '',
                rating: '',
                adding: false,
                form: false
            })
            console.log('done with book');
            this.getAllData();
            return response.json()  
        });
    }
    updateBook = (each, e) =>{
        this.setState({
            editing: true,
            form: true
        })
        this.setState({
            authorfirst: each.authorfirst, 
            authorlast: each.authorlast,
            title: each.title, 
            status: each.status, 
            rating: each.rating,
            bookid: each.id,
            datedone: each.datedone
        })
    }
    handleSubmitEdit = event => {
        const dataEdit = {
            authorfirst: this.state.authorfirst,
            authorlast: this.state.authorlast,
            title: this.state.title,
            rating: this.state.rating,
            status: this.state.status,
            datedone: this.state.datedone
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
                authorfirst: '', 
                authorlast: '', 
                title: '', 
                status: 'select-status', 
                datedone: '',
                editing: false,
                form: false
            })
        }).then( () =>{
            console.log('done with book edit')
            setTimeout(() =>{
                    this.getAllData();
            }, 1000);
        })
    }
    handleChange = e => this.setState({
    [e.target.name]: e.target.value
    })
    updateStatus = e => {
        console.log(e.target.value)
        this.setState({
            status: e.target.value
        })
    }
    updateRating = e => {
        console.log(e.target.value)
        this.setState({
            rating: e.target.value
        })
    }
    renderAllData(){
        return this.state.allData.filter(one => one.username === this.state.username && one.title).map((each, index) => 
            <tr key={each.id}><td>{each.title}</td><td>{each.authorfirst} {each.authorlast}</td><td>{each.status}</td><td>{each.datedone}</td><td>{each.rating}</td>
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
    const { submitting, authorfirst, authorlast, title, status, datedone, rating} = this.state;
    let welcomeContent;
        return(
            <div>
                <Row>
                    <Col md={8}>
                        <table className="book-table">
                            <thead>
                                <tr>
                                    <th>Book title</th>
                                    <th>Author</th>
                                    <th>Status</th>
                                    <th>Date finished</th>
                                    <th>Rating</th>
                                    {!this.state.form &&
                                        <th>Edit</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                            {this.renderAllData()}
                            </tbody>
                        </table>
                    </Col>
                    <Col md={4}>
                    {!this.state.editing && !this.state.form &&
                        <input type='submit' id="add" value="Add a book" onClick={this.showAddForm}></input>
                    }
                    {this.state.form &&
                    <form onSubmit={this.state.adding ? this.handleSubmit : this.handleSubmitEdit} className={submitting ? 'loading' : 'submit-form'}>
                        <p>
                            <label >Title:<br />
                            <input type="text" name='title' value={title} onChange={this.handleChange} />
                                </label>
                        </p>
                        <p>
                            <label >Author first name:<br />
                                <input type="text" name='authorfirst' value={authorfirst} onChange={this.handleChange} /> 
                            </label>
                        </p>
                        <p>
                            <label>Author last name: <br />
                                <input type="text" name="authorlast" value={authorlast}  onChange={this.handleChange} />
                            </label>
                        </p>
                        <p>
                            <label>Status: <br />
                                <select defaultValue={"select-status"} onChange={this.updateStatus}>>
                                    <option value="select-status" disabled>Select status</option>
                                    <option value="Finished">Finished</option>
                                    <option value="Currently-Reading">Currently reading</option>
                                    <option value="Want-to-read">Want to read</option>
                                </select>
                            </label>
                        </p>
                       
                        {status === "Finished" &&
                         <div>
                         <p>
                         <label>Recommendation: <br />
                             <select defaultValue={"select-rating"} onChange={this.updateRating}>>
                                 <option value="select-rating" disabled>Select rating</option>
                                 <option value="Highly Recommend">Highly recommend</option>
                                 <option value="Recommend">Recommend</option>
                                 <option value="Do-not-Recommend">Don't recommend</option>
                                 <option value="Do-not-read">Please do not read</option>
                             </select>
                         </label>
                        </p>
                        <p>
                        <label >Date finished:<br />
                                <input type="text" name='datedone' value={datedone} onChange={this.handleChange} /> 
                        </label>
                        </p>
                        </div>
                        }
                        <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Submit'}></input>
                    </form>   
                    }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default BookForm;

