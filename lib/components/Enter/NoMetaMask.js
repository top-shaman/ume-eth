"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

require("./NoMetaMask.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Enter/NoMetaMask.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NoMetaMask extends _react.default.Component {
  componentDidMount() {
    (0, _Animation.fadeIn)('.NoMetaMask p#p1', 3000);
    setTimeout(() => (0, _Animation.fadeIn)('.NoMetaMask p#p2', 3000), 3000);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "NoMetaMask",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 13,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "p1",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 14,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      id: "install",
      href: "https://metamask.io/download",
      target: "_blank",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 11
      }
    }, "Please install ", /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 94
      }
    }, "MetaMask"), " to use"), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      id: "ume",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 11
      }
    }, "uMe")), /*#__PURE__*/_react.default.createElement("p", {
      id: "p2",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      id: "download",
      href: "https://metamask.io/download",
      target: "_blank",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20,
        columnNumber: 11
      }
    }, "(You can download ", /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20,
        columnNumber: 98
      }
    }, "MetaMask"), " here)")));
  }

}

var _default = NoMetaMask;
exports.default = _default;