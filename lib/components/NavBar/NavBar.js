"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

require("./NavBar.css");

var _UMEGreen96px = _interopRequireDefault(require("../../resources/UME-green-96px.png"));

var _HomeGreen = _interopRequireDefault(require("../../resources/Home-Green.svg"));

var _userGreen = _interopRequireDefault(require("../../resources/user-green.svg"));

var _gear = _interopRequireDefault(require("../../resources/gear.svg"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/NavBar/NavBar.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class NavBar extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      creatingMeme: false
    };
    this.handleMemeClick = this.handleMemeClick.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
  }

  handleMemeClick(e) {
    e.preventDefault();
    this.setState({
      creatingMeme: true
    });
    this.props.handleCreateMeme(true);
  }

  handleRefreshClick(e) {
    e.preventDefault();
    this.props.handleRefreshClick(e);
  }

  handleHomeClick(e) {
    e.preventDefault();
    localStorage.setItem('focusPage', 'timeline');
    this.props.handleToTimeline(e);
  }

  handleProfileClick(e) {
    e.preventDefault();
    localStorage.setItem('focusPage', 'profile');
    this.props.handleToProfile(this.state.account);
  }

  handleSettingsClick(e) {
    e.preventDefault();
    localStorage.setItem('focusPage', 'settings');
    this.props.handleToSettings(e);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("nav", {
      className: "navbar",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("small", {
      id: "logo",
      onClick: this.handleRefreshClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "logo",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      id: "logo",
      src: _UMEGreen96px.default,
      alt: "logo",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 13
      }
    }))), /*#__PURE__*/_react.default.createElement("a", {
      id: "home",
      href: "/home",
      onClick: this.handleHomeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "home",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "icon",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 74,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _HomeGreen.default,
      alt: "home",
      id: "icon",
      width: "26px",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 15
      }
    })), /*#__PURE__*/_react.default.createElement("span", {
      id: "link",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 78,
        columnNumber: 13
      }
    }, "Home"))), /*#__PURE__*/_react.default.createElement("a", {
      id: "profile",
      href: "/profile",
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 81,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "profile",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 86,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "icon",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 87,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _userGreen.default,
      alt: "profile",
      id: "icon",
      width: "27px",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 88,
        columnNumber: 15
      }
    })), /*#__PURE__*/_react.default.createElement("span", {
      id: "link",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 90,
        columnNumber: 13
      }
    }, "Profile"))), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme",
      onClick: this.handleMemeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 108,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 113,
        columnNumber: 11
      }
    }, "Meme")), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-small",
      onClick: this.handleMemeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 115,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 119,
        columnNumber: 11
      }
    }, "+")));
  }

}

var _default = NavBar;
exports.default = _default;