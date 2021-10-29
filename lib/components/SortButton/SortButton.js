"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.array.sort.js");

var _react = _interopRequireDefault(require("react"));

require("./SortButton.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/SortButton/SortButton.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SortButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: this.props.sort,
      isOver: null
    };
    this.handleOver = this.handleOver.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    if (this.state.sort === 'time') {
      this.props.handleSort([e, 'boost']);
    } else if (this.state.sort === 'boost') {
      this.props.handleSort([e, 'time']);
    }
  }

  handleOver(e) {
    e.preventDefault();

    if (!this.state.isOver) {
      this.setState({
        isOver: true
      });
    }
  }

  handleLeave(e) {
    e.preventDefault();

    if (this.state.isOver) {
      this.setState({
        isOver: false
      });
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("p", {
      id: "sort-button",
      className: "SortButton",
      onClick: this.handleClick,
      onMouseOver: this.handleOver,
      onMouseLeave: this.handleLeave,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42,
        columnNumber: 7
      }
    }, !this.state.isOver ? /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 15
      }
    }, "Sort: ", /*#__PURE__*/_react.default.createElement("span", {
      id: "style",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 27
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "style",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 29
      }
    }, this.state.sort[0].toUpperCase() + this.state.sort.slice(1)))) : /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54,
        columnNumber: 15
      }
    }, "To:   ", /*#__PURE__*/_react.default.createElement("span", {
      id: "style",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54,
        columnNumber: 27
      }
    }, this.state.sort === 'time' ? /*#__PURE__*/_react.default.createElement("span", {
      id: "style",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56,
        columnNumber: 35
      }
    }, "Boost") : this.state.sort === 'boost' ? /*#__PURE__*/_react.default.createElement("span", {
      id: "style",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 58,
        columnNumber: 39
      }
    }, "Time") : '')));
  }

}

var _default = SortButton;
exports.default = _default;