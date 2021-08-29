import React, { Component } from 'react'
import Web3 from 'web3'
import Identicon from 'identicon.js'
import './App.css';
import UserInterface from '../../abis/UserInterface.json'
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Main from '../Main'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ume: null,
      memes: [],
      loading: true
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <NavBar />
        </div>
        <div className="App-body">
          <div className="App-subheader">
            <section className="App-subheader" id="title">
              <a href="#home">
                <p>
                  uMe
                </p>
              </a>
            </section>
            <section className="App-subheader" id="searchBar">
              <SearchBar />
            </section>
          </div>
              <div className="timeline">
              { this.state.loading
                ? <div id="loader" className="Content">
                    <p>Loading...</p>
                  </div>
                : <Main />

              }
              </div>
        </div>
      </div>
    );
  }
}

export default App;
