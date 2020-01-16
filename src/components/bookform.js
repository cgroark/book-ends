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
            editing: false
        }

    }
    componentDidMount =() => {
        console.log('mounted', this.props.username);
        this.setState({username: this.props.username});
        this.getAllData();
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
            })
    }
    updateBook = (each, e) =>{
        this.setState({editing: true})
        console.log(each, e);
        this.setState({
            authorfirst: each.authorfirst, 
            authorlast: each.authorlast,
            title: each.title, 
            status: each.status, 
            rating: each.rating,
            datedone: each.datedone
        })
        console.log(this.state.title)
    }
    renderAllData(){
        return this.state.allData.filter(one => one.username === this.state.username && one.title).map((each, index) => 
            <tr key={each.title}><td>{each.title}</td><td>{each.authorfirst} {each.authorlast}</td><td>{each.status}</td><td>{each.datedone}</td><td>{each.rating}</td>
            <td>
            <label htmlFor="edit"></label>
            <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
            </td>
            
            </tr>
        )
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
    handleSubmit = event => {
        const dataSend = {
            authorfirst: this.state.authorfirst,
            authorlast: this.state.authorlast,
            username: this.state.username,
            title: this.state.title,
            status: this.state.status,
            datedone: this.state.datedone
        }
        console.log(dataSend)
        event.preventDefault()
        this.setState({
            submitting: true
        })
        console.log('before fetch', this.state.submitting)
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
                datedone: ''
            })
            console.log('done with book')
            this.getAllData();
            return response.json()  
        });
      }
      handleSubmitEdit = event => {
        const dataSend = {
            authorfirst: this.state.authorfirst,
            authorlast: this.state.authorlast,
            username: this.state.username,
            title: this.state.title,
            rating: this.state.rating,
            status: this.state.status,
            datedone: this.state.datedone
        }
        console.log(dataSend)
        event.preventDefault()
        this.setState({
            submitting: true
        })
        console.log('before fetch', this.state.submitting)
        fetch('https://sheet.best/api/sheets/f1c6e2c7-2b3d-4f85-8e10-39c1cf415351', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'UPATCH',
            body: JSON.stringify(dataSend)
        }).then( (response) => {
            this.setState({
                submitting: false,
                authorfirst: '', 
                authorlast: '', 
                title: '', 
                status: 'select-status', 
                datedone: ''
            })
            console.log('done with book')
            this.getAllData();
            return response.json()  
        });
      }
      render(){
        const { submitting, authorfirst, authorlast, title, status, datedone} = this.state;
        let welcomeContent;
       
        return(
            <div>
                <Row>
                    <Col md={8}>
                        {this.state.editing &&
                            <div className="editor">
                                <h3>Make your edits</h3>
                                    <form onSubmit={this.handleSubmitEdit} className={submitting ? 'loading' : 'submit-form'}>
                                        Edit your new book
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
                                            <label >Date finished:<br />
                                                <input type="text" name='datedone' value={datedone} onChange={this.handleChange} /> 
                                            </label>
                                        }
                                        <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Submit'}></input>
                                    </form>  
                            </div>
                        }
                        <table className="book-table">
                            <thead>
                                <tr>
                                    <th>Book title</th>
                                    <th>Author</th>
                                    <th>Status</th>
                                    <th>Date finished</th>
                                    <th>Rating</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.renderAllData()}
                            </tbody>
                        </table>
                    </Col>
                    <Col md={4}>
                    <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
                        Add a new book
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
                            <label >Date finished:<br />
                                <input type="text" name='datedone' value={datedone} onChange={this.handleChange} /> 
                            </label>
                        }
                        <input type='submit' disabled={submitting} value={submitting ? 'Loading...' : 'Submit'}></input>
                    </form>   
                    </Col>
                </Row>
            </div>
        )
    }
}

export default BookForm;

