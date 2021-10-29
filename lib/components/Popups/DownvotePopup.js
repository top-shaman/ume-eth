"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.parse-float.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

require("./DownvotePopup.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Popups/DownvotePopup.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DownvotePopup extends _react.default.Component {
  constructor(props) {
    super(props);
    this.div = /*#__PURE__*/_react.default.createRef();
    this.state = {
      account: this.props.account,
      memeId: this.props.memeId,
      umeBalance: parseInt(this.props.umeBalance),
      boostValue: 0,
      positionX: this.props.positionX,
      positionY: this.props.positionY,
      interface: this.props.interface
    };
    this.input = /*#__PURE__*/_react.default.createRef();
    this.field = /*#__PURE__*/_react.default.createRef();
    this.button = /*#__PURE__*/_react.default.createRef();
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    (0, _Animation.fadeIn)('div#downvote-popup', 300);
    this.div.style.left = "".concat(this.state.positionX, "px");

    if (parseFloat(this.state.positionY) < 150) {
      this.div.style.top = "".concat(parseFloat(this.state.positionY) + 135, "px");
    } else {
      this.div.style.top = "".concat(this.state.positionY, "px");
    }

    this.div.style.display = 'block';
  }

  componentDidUpdate() {
    this.div.style.left = "".concat(this.props.positionX, "px");

    if (parseFloat(this.state.positionY) < 150) {
      this.div.style.top = "".concat(parseFloat(this.state.positionY) + 135, "px");
    } else {
      this.div.style.top = "".concat(this.state.positionY, "px");
    }
  }

  handleFocus(e) {
    e.preventDefault();
    this.field.style.border = '0.2rem solid #4F56DF';
  }

  async handleChange(e) {
    e.preventDefault();
    await this.setState({
      boostValue: parseInt(e.target.value)
    });
    this.validate();
    console.log(this.state.valid);
  }

  async handleClick(e) {
    this.props.handleBanner(['Waiting', 'Downvote', this.state.memeId + '-downvote']);
    e.preventDefault();

    if (this.state.valid) {
      await this.state.interface.methods.unBoostMeme(this.state.account, this.state.memeId, this.state.boostValue).send({
        from: this.state.account
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'Downvote', this.state.memeId + '-downvote']);
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'Downvote', this.state.memeId + '-downvote']);
      }).catch(e => {
        this.props.handleBanner(['Cancel', 'Downvote', this.state.memeId + '-downvote']);
        console.error(e);
      });
      this.props.handleClose();
    }
  }

  async increment() {
    if (!this.state.boostValue && this.state.boostValue < this.state.boostValue - 5) this.setState({
      boostValue: 5
    });else if (this.state.boostValue > this.state.umeBalance - 5) this.setState({
      boostValue: this.state.umeBalance
    });else this.setState({
      boostValue: this.state.boostValue + 5
    });
    this.field.style.border = '0.2rem solid #4F56DF';
  }

  async decrement() {
    if ((await !this.state.boostValue) || (await this.state.boostValue) < 5) {
      await this.setState({
        boostValue: 0
      });
    } else {
      await this.setState({
        boostValue: this.state.boostValue - 5
      });
    }

    this.field.style.border = '0.2rem solid #4F56DF';
  }

  async validate() {
    if (this.state.boostValue > 0 && this.state.umeBalance >= this.state.boostValue) {
      this.button.style.backgroundColor = '#4F56DF';
      this.button.style.color = '#FFFFFF';
      this.button.style.cursor = 'pointer';
      await this.setState({
        valid: true
      });
    } else {
      this.button.style.backgroundColor = '#667777';
      this.button.style.color = '#CCDDDD';
      this.button.style.cursor = 'default';
      await this.setState({
        valid: false
      });
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      id: "downvote-popup",
      ref: Ref => this.div = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 128,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("form", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 133,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "boost",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 134,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("label", {
      htmlFor: "boost",
      id: "boost",
      onClick: this.handleClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 135,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "boost",
      ref: Ref => this.button = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 136,
        columnNumber: 17
      }
    }, "Demote")), /*#__PURE__*/_react.default.createElement("div", {
      id: "boost-field",
      onFocus: this.handleFocus,
      ref: Ref => this.field = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 143,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "decrease",
      onClick: async () => this.decrement().then(() => this.validate()),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 148,
        columnNumber: 17
      }
    }, "-"), this.state.umeBalance ? /*#__PURE__*/_react.default.createElement("input", {
      type: "number",
      id: "boost",
      name: "boost",
      min: "0",
      max: this.state.umeBalance,
      step: "5",
      onChange: this.handleChange,
      value: this.state.boostValue,
      ref: Ref => this.input = Ref,
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 152,
        columnNumber: 23
      }
    }) : '', /*#__PURE__*/_react.default.createElement("span", {
      id: "increase",
      onClick: async () => this.increment().then(() => this.validate()),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 166,
        columnNumber: 15
      }
    }, "+")))));
  }

}

var _default = DownvotePopup;
exports.default = _default;