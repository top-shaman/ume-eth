"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

require("./NoWallet.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Enter/NoWallet.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NoWallet extends _react.default.Component {
  componentDidMount() {
    (0, _Animation.fadeIn)('.NoWallet p#p1', 3000);
    setTimeout(() => (0, _Animation.fadeIn)('.NoWallet p#p3', 3000), 3000);
  }

  componentWillUnmount() {
    (0, _Animation.fadeOut)('.NoWallet', 2000);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "NoWallet",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "p1",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16,
        columnNumber: 9
      }
    }, "Please connect MetaMask Wallet"), /*#__PURE__*/_react.default.createElement("p", {
      id: "p3",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 9
      }
    }, "(You may have to refresh page)"));
  }

}

var _default = NoWallet;
exports.default = _default;