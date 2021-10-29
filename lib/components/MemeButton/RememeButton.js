"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

var _rememe = _interopRequireDefault(require("../../resources/rememe.svg"));

require("./RememeButton.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/MemeButton/RememeButton.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RememeButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeId: this.props.memeId,
      username: this.props.username,
      address: this.props.address,
      text: this.props.text,
      author: this.props.author,
      parentId: this.props.parentId,
      reponses: this.props.responses,
      isMain: this.props.isMain,
      rememeCountTotal: this.props.rememeCountTotal
    };
    this.rememe = /*#__PURE__*/_react.default.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {}

  handleClick(e) {
    (0, _Animation.bobble)('#' + this.rememe.id, 500);
    this.rememeClick();
  }

  handleMouseEnter(e) {
    e.preventDefault();

    if (this.rememe.style.filter !== 'sepia(1) brightness(0.4) saturate(10000%) hue-rotate(140deg)') {
      const brightnessStart = 0.7,
            brightnessEnd = 0.4,
            hue = 140,
            elementName = '#' + this.rememe.id;
      (0, _Animation.filterIn)(elementName, brightnessStart, brightnessEnd, hue, 200);
    }

    this.props.handleOverRememe(this.rememe.style.filter);
  }

  handleMouseLeave(e) {
    e.preventDefault();
    const brightnessStart = 0.4,
          brightnessEnd = 0.6,
          hue = 140,
          elementName = '#' + this.rememe.id;
    (0, _Animation.filterOut)(elementName, brightnessStart, brightnessEnd, hue, 200);
    this.props.handleOverRememe(this.rememe.style.filter);
  }

  async rememeClick() {
    this.props.handleRememe([this.state.username, this.state.address, this.state.author, this.state.text, this.state.memeId, this.state.parentId]);
  }

  render() {
    if (!this.state.isMain) {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "rememe",
        id: 'rememe-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: Ref => this.rememe = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 69,
          columnNumber: 9
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "rememe",
        src: _rememe.default,
        alt: "rememe button",
        id: "rememe",
        width: "16px",
        height: "16px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 77,
          columnNumber: 11
        }
      }), /*#__PURE__*/_react.default.createElement("span", {
        className: "rememe",
        id: "rememe-count",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78,
          columnNumber: 11
        }
      }, this.state.rememeCountTotal));
    } else {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "rememe",
        id: 'rememe-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: Ref => this.rememe = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 84,
          columnNumber: 9
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "rememe",
        src: _rememe.default,
        alt: "rememe button",
        id: "rememe",
        width: "21px",
        height: "21px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 92,
          columnNumber: 11
        }
      }));
    }
  }

}

var _default = RememeButton;
exports.default = _default;