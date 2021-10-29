"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("./Tag.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Tag/Tag.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Tag extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handleTag(this.state.address);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("a", {
      href: this.state.address.slice(1),
      id: "at",
      onClick: this.handleClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23,
        columnNumber: 7
      }
    }, this.state.address);
  }

}

var _default = Tag;
exports.default = _default;