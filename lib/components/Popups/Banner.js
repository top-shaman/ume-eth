"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

require("./Banner.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Popups/Banner.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Banner extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerId: this.props.bannerId
    };
  }

  async componentDidMount() {
    //    const banner = document.querySelector('div.Banner')
    //    banner.style.top = 'calc(2% + ' + this.props.offsetY + 'px)'
    await this.formatId();

    if (this.props.type === 'Waiting' || this.props.type === 'Loading') {
      (0, _Animation.zipUp)('div#Banner-' + this.state.bannerId, 500);
      (0, _Animation.fadeIn)('div#Banner-' + this.state.bannerId, 500);
    }

    const banner = document.querySelector('div#Banner-' + this.state.bannerId),
          container = document.querySelector('div#Banner-' + this.state.bannerId + ' div#container');

    if (this.props.type === 'Success') {
      container.style.border = '0.15rem solid #00CC89';
    }

    setTimeout(() => {
      banner.style.animation = 'drift 2s ease-in-out infinite';
    }, 500);
  }

  async formatId() {
    const regex = /\W/g;
    this.setState({
      bannerId: this.state.bannerId.replace(regex, '_')
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      id: 'Banner-' + this.state.bannerId,
      className: "Banner" //        top={'calc(2% + ' + this.props.offsetY + 'px)'}
      ,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 37,
        columnNumber: 7
      }
    }, this.props.type === 'Writing' ? /*#__PURE__*/_react.default.createElement("div", {
      id: "container-writing",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 44,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 45,
        columnNumber: 19
      }
    }, "Blockchain Action")), /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 47,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "plain",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 48,
        columnNumber: 19
      }
    }, "Writing "), /*#__PURE__*/_react.default.createElement("span", {
      id: "highlight",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 49,
        columnNumber: 19
      }
    }, this.props.message), /*#__PURE__*/_react.default.createElement("span", {
      id: "plain",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 19
      }
    }, " to Blockchain..."))) : this.props.type === 'Waiting' ? /*#__PURE__*/_react.default.createElement("div", {
      id: "container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 55,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 23
      }
    }, "MetaMask Pending")), /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 58,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "plain",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 23
      }
    }, "Please confirm "), /*#__PURE__*/_react.default.createElement("span", {
      id: "highlight",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 23
      }
    }, this.props.message), /*#__PURE__*/_react.default.createElement("span", {
      id: "plain",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 23
      }
    }, " in MetaMask"))) : this.props.type === 'Loading' ? /*#__PURE__*/_react.default.createElement("div", {
      id: "container-loading",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 65,
        columnNumber: 23
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66,
        columnNumber: 25
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 67,
        columnNumber: 27
      }
    }, "Loading ", this.props.message)), /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 69,
        columnNumber: 25
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 70,
        columnNumber: 27
      }
    }, "Reading Blockchain..."))) : this.props.type === 'Success' ? /*#__PURE__*/_react.default.createElement("div", {
      id: "container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 74,
        columnNumber: 27
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "Banner-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75,
        columnNumber: 29
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 31
      }
    }, "Success!"))) : '');
  }

}

var _default = Banner;
exports.default = _default;