import React, {Component} from 'react'
import "./SearchBar.css"

class SearchBar extends Component {

  render() {
    return(
      <div className="SearchBar">
        <form>
          <input
            className="SearchBar_input"
            type="search"
            id="search"
            name="search"
            size="24"
            placeholder="Search uMe"
            required>
          </input>
        </form>
      </div>
    );
  }
}

export default SearchBar
