"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

var _arrow = _interopRequireDefault(require("../../resources/arrow.svg"));

require("./DownvoteButton.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/MemeButton/DownvoteButton.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DownvoteButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeId: this.props.memeId,
      isMain: this.props.isMain,
      interface: this.props.interface
    };
    this.downvote = /*#__PURE__*/_react.default.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  async componentDidMount() {}

  async handleClick(e) {
    (0, _Animation.bobble)('#' + this.downvote.id, 500);
    await this.props.handleDownvotePopup([e, this.state.memeId]);
  }

  handleMouseEnter(e) {
    e.preventDefault();
    let brightnessEnd,
        hue,
        elementName,
        brightnessStart = 0.7;

    if (e.target === this.downvote && this.downvote.style.filter !== 'invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(180deg)') {
      brightnessEnd = 0.4;
      hue = 180;
      elementName = '#' + this.downvote.id;
      (0, _Animation.filterIn)(elementName, brightnessStart, brightnessEnd, hue, 200);
    }

    this.props.handleOverDownvote(this.downvote.style.filter);
  }

  handleMouseLeave(e) {
    e.preventDefault();
    let brightnessStart,
        hue,
        elementName,
        brightnessEnd = 0.6;

    if (e.target === this.downvote || e.target.className === this.downvote.className) {
      brightnessStart = 0.4;
      hue = 180;
      elementName = '#' + this.downvote.id;
      (0, _Animation.filterOut)(elementName, brightnessStart, brightnessEnd, hue, 200);
    }

    this.props.handleOverDownvote(this.downvote.style.filter);
  }

  render() {
    if (!this.state.isMain) {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "downvote",
        id: 'downvote-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: Ref => this.downvote = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 57,
          columnNumber: 11
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "downvote",
        src: _arrow.default,
        alt: "downvote button",
        id: "downvote",
        width: "16px",
        height: "16px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 65,
          columnNumber: 13
        }
      }));
    } else {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "downvote",
        id: 'downvote-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: Ref => this.downvote = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 71,
          columnNumber: 11
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "downvote",
        src: _arrow.default,
        alt: "downvote button",
        id: "downvote",
        width: "21px",
        height: "21px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 79,
          columnNumber: 13
        }
      }));
    }
  }

}

var _default = DownvoteButton;
exports.default = _default;