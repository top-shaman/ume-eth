"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _UMEGreen = _interopRequireDefault(require("../../resources/UME-green.svg"));

var _Animation = require("../../resources/Libraries/Animation");

require("./Enter.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Enter/Enter.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Enter extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      mouseOver: false,
      entered: false,
      registered: false
    };
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    (0, _Animation.fadeIn)('.Enter p#p1', 3000);
    setTimeout(() => (0, _Animation.fadeIn)('.Enter p#p2', 3000), 500);
    setTimeout(() => (0, _Animation.fadeIn)('.Enter p#p3', 3000), 1000);
    setTimeout(() => (0, _Animation.lightBlurToFadeIn)('.Enter p#title', 3000), 2500);
    setTimeout(() => {
      const logo = document.querySelector('.Enter img');
      logo.style.cursor = 'pointer';
      (0, _Animation.lightBlurToFadeIn)('.Enter img', 5000);
    }, 3200);
    setTimeout(() => (0, _Animation.fadeIn)('.Enter p#p4', 3000), 6500);
  }

  componentWillUnmount() {
    (0, _Animation.fadeOut)('img.Enter', 1500);
  }

  handleMouseOver(e) {
    e.preventDefault();
    this.setState({
      mouseOver: true
    });

    if (!this.state.mouseOver) {
      (0, _Animation.bobble)('img.Enter', 2100);
    }
  }

  handleMouseLeave(e) {
    e.preventDefault();
    this.setState({
      mouseOver: false
    });
  }

  handleClick(e) {
    e.preventDefault();
    (0, _Animation.expandToFadeOut)('.Enter img', 2000);
    (0, _Animation.fadeOut)('.Enter div#fade-box', 1000);
    setTimeout(() => {
      this.setState({
        entered: true
      });
      this.props.hasEntered(this.state.entered);
    }, 1500);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "Enter",
      id: "Enter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("article", {
      className: "Enter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 10
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "fade-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "p1",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 15
      }
    }, "Hello,"), /*#__PURE__*/_react.default.createElement("p", {
      id: "p2",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 64,
        columnNumber: 15
      }
    }, this.props.account + ' !'), /*#__PURE__*/_react.default.createElement("p", {
      id: "p3",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 65,
        columnNumber: 15
      }
    }, "Welcome... to"), /*#__PURE__*/_react.default.createElement("p", {
      id: "title",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66,
        columnNumber: 15
      }
    }, "uMe")), /*#__PURE__*/_react.default.createElement("img", {
      id: "logo",
      src: _UMEGreen.default,
      alt: "uMe logo",
      onMouseOver: this.handleMouseOver,
      onMouseLeave: this.handleMouseLeave,
      onClick: this.handleClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      id: "fade-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "p4",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 77,
        columnNumber: 15
      }
    }, "(Click logo to get started)"))));
  }

}

var _default = Enter;
exports.default = _default;