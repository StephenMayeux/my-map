import React, { Component } from 'react'
import '../App.css';
export default class Nav extends Component {
  state = {
    searchInput: '',
  }

  //formHandler: sets state typed query in input
  formHandler = (event) => {
    this.setState({searchInput: event.target.value})
  }


  render() {
    const searchedInput = this.state.searchInput
    return (
      <div className="searchNav">
        <h3>Austin Venue Search</h3>
          <input 
                className="search"
                onChange={this.formHandler} 
                type="text" 
                placeholder="Search Venue" 
                name="searchInput" 
                id="searchInput"/>
        <button onClick={this.props.getVenues.bind(null, {searchedInput})}/>
          Search
      </div>
    )
  }
}

