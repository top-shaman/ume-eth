import React, { Component } from 'react'
import Web3 from 'web3'
import Identicon from 'identicon.js'
import './App.css';
import UserInterface from '../abis/UserInterface.json'
import NavBar from './NavBar'
//import Main from './Main'

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
      </div>
    );
  }
}

export default App;
