"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _UMEGreen = _interopRequireDefault(require("../../resources/UME-green.svg"));

var _Animation = require("../../resources/Libraries/Animation");

require("./PageLoader.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Loader/PageLoader.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PageLoader extends _react.default.Component {
  componentDidMount() {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'hidden');
    (0, _Animation.expandFadeInBobble)('div.PageLoader', 2000);
  }

  componentWillUnmount() {
    (0, _Animation.expandToFadeOut)('div.PageLoader', 1500);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "PageLoader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 18,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _UMEGreen.default,
      alt: "logo",
      id: "logo",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19,
        columnNumber: 9
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      id: "Border-Spinner",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20,
        columnNumber: 9
      }
    }));
  }

}

var _default = PageLoader;
exports.default = _default;