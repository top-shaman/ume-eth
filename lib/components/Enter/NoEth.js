"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

var _SelectNetwork = _interopRequireDefault(require("../../resources/Select-Network.png"));

var _SendRopsten = _interopRequireDefault(require("../../resources/Send-Ropsten.png"));

var _CopyAccount = _interopRequireDefault(require("../../resources/Copy-Account.png"));

require("./NoEth.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Enter/NoEth.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NoEth extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      overP1: false,
      overP2: false,
      overlay: false
    };
    this.handleP1Enter = this.handleP1Enter.bind(this);
    this.handleP1Leave = this.handleP1Leave.bind(this);
    this.handleP2Enter = this.handleP2Enter.bind(this);
    this.handleP2Leave = this.handleP2Leave.bind(this);
  }

  componentDidMount() {
    (0, _Animation.fadeIn)('.NoEth p#p1', 3000);
    setTimeout(() => (0, _Animation.fadeIn)('.NoEth p#p2', 3000), 1000);
    setTimeout(() => (0, _Animation.fadeIn)('.NoEth p#p3', 3000), 2000);
    setTimeout(() => (0, _Animation.fadeIn)('.NoEth p#p4', 3000), 4000);
  }

  handleP1Enter(e) {
    if (!this.state.overP1 && !this.state.overP2) {
      this.setState({
        overP1: true
      });
      setTimeout(() => {
        const img = document.querySelector('.NoEth img');
        img.style.opacity = '1';
      }, 50);
    }
  }

  handleP1Leave(e) {
    if (this.state.overP1) {
      const img = document.querySelector('.NoEth img');
      img.style.opacity = '0';
      setTimeout(() => {
        this.setState({
          overP1: false
        });
      }, 500);
    }
  }

  handleP2Enter(e) {
    if (!this.state.overP2 && !this.state.overP1) {
      this.setState({
        overP2: true
      });
      setTimeout(() => {
        const img = document.querySelectorAll('.NoEth img');
        img.forEach(elem => elem.style.opacity = '1');
      }, 50);
    }
  }

  handleP2Leave(e) {
    if (this.state.overP2) {
      const img = document.querySelectorAll('.NoEth img');
      img.forEach(elem => elem.style.opacity = '0');
      setTimeout(() => {
        this.setState({
          overP2: false
        });
      }, 500);
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "NoEth",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "image-section",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 77,
        columnNumber: 9
      }
    }, this.state.overP1 ? /*#__PURE__*/_react.default.createElement("img", {
      src: _SelectNetwork.default,
      alt: "select-network",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 79,
        columnNumber: 15
      }
    }) : '', this.state.overP2 ? /*#__PURE__*/_react.default.createElement("div", {
      id: "send-ropsten",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 86,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      id: "copy",
      src: _CopyAccount.default,
      alt: "copy-account",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 88,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement("img", {
      id: "send",
      src: _SendRopsten.default,
      alt: "send-ropsten",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 93,
        columnNumber: 17
      }
    })) : ''), /*#__PURE__*/_react.default.createElement("p", {
      id: "p1",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 103,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 104,
        columnNumber: 11
      }
    }, "In order to use "), /*#__PURE__*/_react.default.createElement("span", {
      id: "ume",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 105,
        columnNumber: 11
      }
    }, "uMe"), /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 106,
        columnNumber: 11
      }
    }, ", you must:"), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 107,
        columnNumber: 11
      }
    })), /*#__PURE__*/_react.default.createElement("p", {
      id: "p2",
      onMouseOver: this.handleP1Enter,
      onMouseLeave: this.handleP1Leave,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 109,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 114,
        columnNumber: 11
      }
    }, "1. Connect to the ", /*#__PURE__*/_react.default.createElement("span", {
      id: "bold",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 115,
        columnNumber: 31
      }
    }, "Ropsten Testnet"))), /*#__PURE__*/_react.default.createElement("p", {
      id: "p3",
      onMouseOver: this.handleP2Enter,
      onMouseLeave: this.handleP2Leave,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 119,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 124,
        columnNumber: 11
      }
    }, "2. Have ", /*#__PURE__*/_react.default.createElement("span", {
      id: "bold",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 125,
        columnNumber: 21
      }
    }, "Ropsten Ethereum")), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 127,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("a", {
      href: "https://faucet.ropsten.be/",
      target: "_blank",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 128,
        columnNumber: 11
      }
    }, "(click to visit", /*#__PURE__*/_react.default.createElement("span", {
      id: "bold",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 129,
        columnNumber: 28
      }
    }, " Ropsten Ethereum Faucet"), ")")), /*#__PURE__*/_react.default.createElement("p", {
      id: "p4",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 133,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 134,
        columnNumber: 11
      }
    }, "Refresh page once you've received Ropsten ETH")));
  }

}

var _default = NoEth;
exports.default = _default;