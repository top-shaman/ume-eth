"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.search.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireDefault(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _PageLoader = _interopRequireDefault(require("../Loader/PageLoader"));

var _Animation = require("../../resources/Libraries/Animation");

var _web = _interopRequireDefault(require("web3"));

require("./CreateUser.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/CreateUser/CreateUser.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toBytes = string => _web.default.utils.fromAscii(string);

class CreateUser extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      interface: this.props.interface,
      username: '',
      address: '',
      usernameFlag: false,
      addressFlag: false,
      usernameFocused: false,
      addressFocused: false,
      submitText: 'please set username & address',
      submitReady: false,
      registered: false,
      writing: false
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleUsernameFocus = this.handleUsernameFocus.bind(this);
    this.handleAddressFocus = this.handleAddressFocus.bind(this);
    this.handleUsernameBlur = this.handleUsernameBlur.bind(this);
    this.handleAddressBlur = this.handleAddressBlur.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  componentDidMount() {
    (0, _Animation.fadeIn)('div#container.CreateUser', 1500);
  }

  componentDidUpdate() {
    this.checkUsername();
    this.checkAddress();
    this.checkSubmit();
  }

  componentWillUnmount() {
    (0, _Animation.fadeOut)('div#container.CreateUser', 1500);
  }

  handleUsernameChange(e) {
    e.preventDefault();
    this.setState({
      username: e.target.value
    });
  }

  handleAddressChange(e) {
    e.preventDefault();
    this.setState({
      address: e.target.value
    });
  }

  handleUsernameFocus(e) {
    e.preventDefault();
    this.setState({
      usernameFocused: true
    });
  }

  handleAddressFocus(e) {
    e.preventDefault();
    this.setState({
      addressFocused: true
    });
  }

  handleUsernameBlur(e) {
    e.preventDefault();
    this.setState({
      usernameFocused: false
    });
  }

  handleAddressBlur(e) {
    e.preventDefault();
    this.setState({
      addressFocused: false
    });
  }

  checkUsername() {
    // valid characters
    const usernameRegex = /[^A-Za-z0-9_\s,'":?!%&*()+=/^><-]/g;
    const letterRegex = /[^A-Za-z]/g;
    const checkUsername = this.state.username.search(usernameRegex);
    const checkFirstLetter = this.state.username.search(letterRegex);
    const invalidFlag = 'invalid character used';
    const firstFlag = 'first character must be letter';
    const lengthFlag = 'must be at least 2 characters';
    const inputBox = document.querySelector('.CreateUser input#UsernameInput'); // check characters

    if (checkUsername > -1 && this.state.usernameFlag.length === undefined) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
      this.setState({
        usernameFlag: invalidFlag
      });
    } else if (checkUsername < 0 && this.state.usernameFlag === invalidFlag) this.setState({
      usernameFlag: false
    }); // check first character


    if (checkFirstLetter === 0 && this.state.usernameFlag.length === undefined) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
      this.setState({
        usernameFlag: firstFlag
      });
    } else if (checkFirstLetter < 0 && this.state.usernameFlag === firstFlag) {
      this.setState({
        usernameFlag: false
      });
    } // check length


    if (this.state.username.length > 0 && this.state.username.length < 2 && !this.state.usernameFlag) {
      this.setState({
        usernameFlag: lengthFlag
      });
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
    } else if (this.state.username.length > 0 && this.state.username.length < 2 && this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
    } else if (this.state.username.length > 1 && this.state.usernameFlag === lengthFlag) {
      this.setState({
        usernameFlag: false
      });
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
    } // check if focused
    else if (this.state.username.length > 0 && !this.state.usernameFocused && !this.state.usernameFlag) {
      this.setState({
        usernameFocused: true
      });
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
      inputBox.style.backgroundColor = '#282c34';
    } else if (this.state.username.length > 0 && this.state.usernameFocused && !this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
      inputBox.style.backgroundColor = '#282c34';
    } else if (this.state.username.length === 0 && this.state.usernameFocused && !this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #BBAA00';
      inputBox.style.backgroundColor = '#666677';
    } else if (this.state.username.length === 0 && !this.state.usernameFocused && !this.state.usernameFlag) {
      inputBox.style.boxShadow = 'none';
      inputBox.style.backgroundColor = '#666677';
    } else if (this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
    }
  }

  checkAddress() {
    // valid characters
    const addressRegex = /[^A-Za-z0-9_]/g;
    const checkAddress = this.state.address.search(addressRegex);
    const invalidFlag = 'only letters, numbers, underscores are valid';
    const lengthFlag = 'must be at least 2 characters';
    const inputBox = document.querySelector('.CreateUser input#AddressInput'); // character check

    if (checkAddress > -1 && this.state.addressFlag.length === undefined) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
      this.setState({
        addressFlag: invalidFlag
      });
    } else if (checkAddress < 0 && this.state.addressFlag === invalidFlag) this.setState({
      addressFlag: false
    }); // length check functions


    if (this.state.address.length > 0 && this.state.address.length < 2 && !this.state.addressFlag) {
      this.setState({
        addressFlag: lengthFlag
      });
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
    } else if (this.state.address.length > 0 && this.state.address.length < 2 && this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
    } else if (this.state.address.length > 1 && this.state.addressFlag === lengthFlag) {
      this.setState({
        addressFlag: false
      });
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
    } // check if focused
    else if (this.state.address.length > 0 && !this.state.addressFocused && !this.state.addressFlag) {
      this.setState({
        addressFocused: true
      });
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
      inputBox.style.backgroundColor = '#282c34';
    } else if (this.state.address.length > 0 && this.state.addressFocused && !this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
      inputBox.style.backgroundColor = '#282c34';
    } else if (this.state.address.length === 0 && this.state.addressFocused && !this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #BBAA00';
      inputBox.style.backgroundColor = '#666677';
    } else if (this.state.address.length === 0 && !this.state.addressFocused && !this.state.addressFlag) {
      inputBox.style.boxShadow = 'none';
      inputBox.style.backgroundColor = '#666677';
    } else if (this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00';
    }
  }

  checkSubmit() {
    const submit = document.querySelector('.CreateUser input#submit');
    const ready = 'Create Account';
    const noneReady = 'please set username & address';

    if (this.state.usernameFlag.length === undefined && this.state.addressFlag.length === undefined && this.state.username.length !== 0 && this.state.address.length !== 0 && this.state.submitText !== ready) {
      this.setState({
        submitText: ready,
        submitReady: true
      });
      submit.style.backgroundColor = '#00CC89';
      submit.style.color = '#FFFFFF';
      submit.style.cursor = 'pointer';
    } else if ((this.state.usernameFlag.length && this.state.address.length || this.state.username.length && this.state.addressFlag.length || this.state.usernameFlag.length && this.state.address.length === 0 || this.state.username.length === 0 && this.state.addressFlag.length || this.state.username.length === 0 || this.state.address.length === 0 || this.state.username.length === 0 && this.state.address.length === 0) && this.state.submitText !== noneReady) {
      this.setState({
        submitText: noneReady,
        submitReady: false
      });
      submit.style.backgroundColor = '#333334';
      submit.style.color = '#FFFFFF';
      submit.style.cursor = 'default';
    }
  }

  async registerUser(e) {
    this.props.handleBanner(['Waiting', 'New User', this.state.account + '-new-user']);
    const username = toBytes(this.state.username);
    const address = toBytes('@' + this.state.address);
    console.log(username + ' ' + address + ' submitted');

    if (this.state.submitReady) {
      await this.props.interface.methods.newUser(this.state.account, username, address).send({
        from: this.state.account
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'New User', this.state.account + '-new-user']);
        (0, _Animation.fadeOut)('div.CreateUser', 300);
        setTimeout(() => this.props.handleRegistered('writing'), 300);
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'New User', this.state.account + '-new-user']);
        this.props.handleRegistered('registered');
      }).catch(e => {
        this.props.handleBanner(['Cancel', 'New User', this.state.account + '-new-user']);
        console.error(e);
      }); //window.location.reload()
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      id: "container",
      className: "CreateUser",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 253,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "description",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 254,
        columnNumber: 9
      }
    }, "Create username & address to begin"), /*#__PURE__*/_react.default.createElement("p", {
      id: "title",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 257,
        columnNumber: 9
      }
    }, "uMe"), /*#__PURE__*/_react.default.createElement("div", {
      id: "box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 258,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "username",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 259,
        columnNumber: 11
      }
    }, this.state.username), /*#__PURE__*/_react.default.createElement("div", {
      id: "profile-pic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 260,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      id: "ProfilePic",
      account: this.props.account,
      hasEntered: this.props.hasEntered,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 261,
        columnNumber: 13
      }
    })), /*#__PURE__*/_react.default.createElement("p", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 263,
        columnNumber: 11
      }
    }, this.state.address ? '@' + this.state.address : ''), /*#__PURE__*/_react.default.createElement("form", {
      className: "CreateUser",
      id: "CreateUser",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 266,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "CreateUser",
      id: "field",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 267,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("label", {
      htmlFor: "UserName",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 268,
        columnNumber: 15
      }
    }, "username: "), /*#__PURE__*/_react.default.createElement("input", {
      id: "UsernameInput",
      name: "Username",
      type: "text",
      maxLength: "32",
      placeholder: "must be between 2 and 32 characters",
      onChange: this.handleUsernameChange,
      onFocus: this.handleUsernameFocus,
      onBlur: this.handleUsernameBlur,
      autoComplete: "off",
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 269,
        columnNumber: 15
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      id: "subtext",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 281,
        columnNumber: 15
      }
    }, this.state.usernameFlag)), /*#__PURE__*/_react.default.createElement("p", {
      className: "CreateUser",
      id: "field",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 285,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("label", {
      htmlFor: "UserAddress",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 286,
        columnNumber: 15
      }
    }, "address: "), /*#__PURE__*/_react.default.createElement("input", {
      id: "AddressInput",
      name: "UserAddress",
      type: "text",
      maxLength: "31",
      placeholder: "must be between 2 and 31 characters",
      onChange: this.handleAddressChange,
      onFocus: this.handleAddressFocus,
      onBlur: this.handleAddressBlur,
      autoComplete: "off",
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 287,
        columnNumber: 15
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      id: "subtext",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 299,
        columnNumber: 15
      }
    }, this.state.addressFlag)), /*#__PURE__*/_react.default.createElement("p", {
      id: "button",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 303,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("input", {
      type: "button",
      value: this.state.submitText,
      id: "submit",
      onClick: this.registerUser,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 304,
        columnNumber: 15
      }
    })))));
  }

}

var _default = CreateUser;
exports.default = _default;