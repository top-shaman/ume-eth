"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

var _arrow = _interopRequireDefault(require("../../resources/arrow.svg"));

require("./UpvoteButton.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/MemeButton/UpvoteButton.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpvoteButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeId: this.props.memeId,
      account: this.props.account,
      isMain: this.props.isMain
    };
    this.upvote = /*#__PURE__*/_react.default.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  async componentDidMount() {}

  async handleClick(e) {
    (0, _Animation.bobble)('#' + this.upvote.id, 500);
    this.props.handleUpvotePopup([e, this.state.memeId]);
  }

  handleMouseEnter(e) {
    e.preventDefault();
    let brightnessEnd,
        hue,
        elementName,
        brightnessStart = 0.7;

    if (e.target === this.upvote && this.upvote.style.filter !== 'invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(310deg)') {
      brightnessEnd = 0.4;
      hue = 310;
      elementName = '#' + this.upvote.id;
      (0, _Animation.filterIn)(elementName, brightnessStart, brightnessEnd, hue, 200);
    }

    this.props.handleOverUpvote(this.upvote.style.filter);
  }

  handleMouseLeave(e) {
    e.preventDefault();
    let brightnessStart,
        hue,
        elementName,
        brightnessEnd = 0.6;

    if (e.target === this.upvote || e.target.className === 'upvote') {
      brightnessStart = 0.4;
      hue = 310;
      elementName = '#' + this.upvote.id;
      (0, _Animation.filterOut)(elementName, brightnessStart, brightnessEnd, hue, 200);
    }

    this.props.handleOverUpvote(this.upvote.style.filter);
  }

  render() {
    if (!this.state.isMain) {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "upvote",
        id: 'upvote-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: Ref => this.upvote = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 56,
          columnNumber: 11
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "upvote",
        src: _arrow.default,
        alt: "upvote button",
        id: "upvote",
        width: "16px",
        height: "16px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 64,
          columnNumber: 13
        }
      }));
    } else {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "upvote",
        id: 'upvote-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: Ref => this.upvote = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 70,
          columnNumber: 11
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "upvote",
        src: _arrow.default,
        alt: "upvote button",
        id: "upvote",
        width: "21px",
        height: "21px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78,
          columnNumber: 13
        }
      }));
    }
  }

}

var _default = UpvoteButton;
exports.default = _default;