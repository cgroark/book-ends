import React from 'react';


class FriendData extends React.Component {
    constructor(props){
        super(props);
        this.state={
           friendData: []
        }

    }
    componentDidMount =() => {
        this.setState({
            friendData: this.props.data
        })
        console.log('new component', this.props.data)
    }
    
    renderReading(){
        return this.state.friendData.filter(book => book.status === "Currently-Reading").map((each) => 
        <span key={each.id}>{each.title}</span>
        )
    }
    renderAllData(){
        return this.state.friendData.map((each, index) => 
            <tr key={each.id}><td>{each.title}</td><td>{each.authorfirst} {each.authorlast}</td><td>{each.status}</td><td>{each.datedone}</td><td>{each.rating}</td>
            </tr>
        )
    }
    render(){
    const { friendData} = this.state;
    const allBooks = friendData;
    const bookCount = friendData.length;
    return(
            <div className="main-body">
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 &&
                <div>
                    <h3> <i className="fa fa-book" aria-hidden="true"></i>&nbsp;Currently Reading: {this.renderReading()}</h3>
                        <hr />
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

