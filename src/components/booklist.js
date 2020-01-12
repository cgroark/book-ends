import React from 'react';

class BookList extends React.Component {
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
            datedone: ''
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
    renderAllData(){
        return this.state.allData.filter(one => one.username === this.state.username).map((each, index) => 
            <tr key={each.title}><td>{each.title}</td><td>{each.authorfirst} {each.authorlast}</td><td>{each.status}</td></tr>
        )
    }
    render(){
        const { submitting, authorfirst, authorlast, title, allData, status} = this.state;
        let welcomeContent;
        return(
            <div>
                <table className="book-table">
                        <thead>
                            <tr>
                                <th>Book title</th>
                                <th>Author</th>
                                <th>Status</th>
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

export default BookList;

