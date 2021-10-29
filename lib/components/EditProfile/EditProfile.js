"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.search.js");

var _react = _interopRequireDefault(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Animation = require("../../resources/Libraries/Animation");

var _Helpers = require("../../resources/Libraries/Helpers");

require("./EditProfile.css");

var _XWhite = _interopRequireDefault(require("../../resources/X-white.svg"));

var _autosize = _interopRequireDefault(require("autosize"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/EditProfile/EditProfile.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EditProfile extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      username: this.props.username,
      address: this.props.address,
      bio: this.props.bio,
      editing: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      nameText: this.props.username,
      bioText: this.props.bio,
      nameTextFocused: false,
      bioTextFocused: false,
      flagName: '',
      flagBio: '',
      isClickable: false
    };
    this.textareaName = /*#__PURE__*/_react.default.createRef();
    this.nameBox = /*#__PURE__*/_react.default.createRef();
    this.textareaBio = /*#__PURE__*/_react.default.createRef();
    this.bioBox = /*#__PURE__*/_react.default.createRef();
    this.handleNameTextChange = this.handleNameTextChange.bind(this);
    this.handleNameTextFocus = this.handleNameTextFocus.bind(this);
    this.handleNameTextBlur = this.handleNameTextBlur.bind(this);
    this.handleBioTextChange = this.handleBioTextChange.bind(this);
    this.handleBioTextFocus = this.handleBioTextFocus.bind(this);
    this.handleBioTextBlur = this.handleBioTextBlur.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  async componentDidMount() {
    const background = document.querySelector('div#background'),
          container = document.querySelector('div#container');
    background.style.top = this.props.offsetY + 'px';
    container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)';

    if (window.innerWidth < 580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY + 'px)';
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)';
    }

    (0, _Animation.fadeIn)('.EditProfile div#container', 333);
    (0, _Animation.partialFadeIn)('.EditProfile div#background', 100, 0.2);
    this.textareaName.focus();
    (0, _autosize.default)(this.textareaName);
    this.textareaBio.focus();
    (0, _autosize.default)(this.textareaBio);
  }

  componentDidUpdate() {
    this.checkUsername();
    this.checkBio();
    this.updateButton();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleNameTextChange(e) {
    e.preventDefault();
    this.setState({
      nameText: e.target.value
    });
  }

  handleNameTextFocus(e) {
    this.setState({
      nameTextFocused: true
    });
  }

  handleNameTextBlur(e) {
    this.setState({
      nameTextFocused: false
    });
  }

  handleBioTextChange(e) {
    e.preventDefault();
    this.setState({
      bioText: e.target.value
    });
  }

  handleBioTextFocus(e) {
    this.setState({
      bioTextFocused: true
    });
  }

  handleBioTextBlur(e) {
    this.setState({
      bioTextFocused: false
    });
  }

  async handleSaveClick(e) {
    if (this.state.username !== this.state.nameText && !this.state.flagName) {
      this.props.handleBanner(['Waiting', 'Username Update', this.state.account + '-username']);
      const nameBytes = await (0, _Helpers.toBytes)(this.state.nameText);
      await this.state.interface.methods.changeUserName(this.state.account, nameBytes).send({
        from: this.state.account
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'Username Update', this.state.account + '-username']);
        this.handleCloseClick(e);
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'Username Update', this.state.account + '-username']);
      }).catch(e => {
        this.props.handleBanner(['Cancel', 'Username Update', this.state.account + '-username']);
        console.error(e);
      });
      this.setState({
        username: this.state.nameText
      });
      localStorage.setItem('userInfo', this.state.account);
    }

    if (this.state.bio !== this.state.bioText) {
      this.props.handleBanner(['Waiting', 'Bio Update', this.state.account + '-bio']);
      await this.state.interface.methods.newBio(this.state.account, this.state.bioText).send({
        from: this.state.account
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'Bio Update', this.state.account + '-bio']);
        this.handleCloseClick(e);
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'Bio Update', this.state.account + '-bio']);
      }).catch(e => {
        this.props.handleError(['Cancel', 'BioUpdate', this.state.account + '-bio']);
        console.error(e);
      });
    }
  }

  async handleCloseClick(e) {
    localStorage.setItem('nameText', this.state.nameText);
    (0, _Animation.fadeOut)('.EditProfile div#container', 500);
    (0, _Animation.partialFadeOut)('.EditProfile div#background', 333, 0.2);
    (0, _Animation.unBlur)('div.Main', 500);
    setTimeout(async () => {
      await this.setState({
        editing: false
      });
      this.props.handleExitEdit(await this.state.editing);
    }, 500);
  }

  async toBytes32(text) {
    const textBytes = await (0, _Helpers.toBytes)(text);
    return await this.state.interface.methods.bytesToBytes32(textBytes).call();
  }

  handleResize(ContainerSize, event) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  checkUsername() {
    // valid characters
    const usernameRegex = /[^A-Za-z0-9_\s,'":?!%&*()+=/^><-]/g,
          letterRegex = /[^A-Za-z]/g,
          checkUsername = this.state.nameText.search(usernameRegex),
          checkFirstLetter = this.state.nameText.search(letterRegex),
          invalidFlag = 'invalid character used',
          firstFlag = 'first character must be letter',
          lengthFlag = 'must be between 2 and 32 characters',
          label = document.querySelector('.EditProfile label#name span#label'); // check characters

    if (checkUsername > -1 && this.state.flagName.length === undefined) {
      label.style.color = '#DD4422';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422';
      this.setState({
        flagName: invalidFlag
      });
    } else if (checkUsername < 0 && this.state.flagName === invalidFlag) this.setState({
      flagName: false
    }); // check first character


    if (checkFirstLetter === 0 && this.state.flagName.length === undefined) {
      label.style.color = '#DD4422';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422';
      this.setState({
        flagName: firstFlag
      });
    } else if (checkFirstLetter < 0 && this.state.flagName === firstFlag) {
      this.setState({
        flagName: false
      });
    } // check length


    if (this.state.nameText.length > 0 && this.state.nameText.length < 2 && !this.state.flagName) {
      this.setState({
        flagName: lengthFlag
      });
      label.style.color = '#DD4422';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422';
    } else if (this.state.nameText.length > 0 && this.state.nameText.length < 2 && this.state.flagName) {
      label.style.color = '#DD4422';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422';
    } else if (this.state.nameText.length > 1 && this.state.flagName === lengthFlag) {
      this.setState({
        flagName: false
      });
      label.style.color = '#00CC89';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
    } // check if focused
    else if (this.state.nameText.length > 0 && !this.state.nameTextFocused && !this.state.flagName) {
      this.setState({
        nameTextFocused: true
      });
      label.style.color = '#00CC89';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
    } else if (this.state.nameText.length > 0 && this.state.nameTextFocused && !this.state.flagName) {
      label.style.color = '#00CC89';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
    } else if (this.state.nameText.length === 0 && this.state.nameTextFocused && !this.state.flagName) {
      label.style.color = '#DD4422';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422';
      this.setState({
        flagName: lengthFlag
      });
    } else if (this.state.nameText.length === 0 && !this.state.nameTextFocused && !this.state.flagName) {
      this.nameBox.style.boxShadow = 'none';
    } else if (this.state.flagName) {
      label.style.color = '#DD4422';
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422';
    }
  }

  checkBio() {
    const label = document.querySelector('.EditProfile label#bio span#label');

    if (this.state.bioText.length > 0) {
      label.style.color = '#00CC89';
      this.bioBox.style.boxShadow = '0 0 0 0.1rem #00CC89';
    } else {
      label.style.color = '#667777';
      this.bioBox.style.boxShadow = '0 0 0 0.1rem #667777';
    }
  }

  updateButton() {
    const button = document.querySelector('.EditProfile p#save-button');

    if (this.state.username !== this.state.nameText && !this.state.flagName) {
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#00CC89';
      button.style.color = '#FFFFFF'; //this.setState({ isClickable: true })
    } else if (this.state.bio !== this.state.bioText) {
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#00CC89';
      button.style.color = '#FFFFFF'; //this.setState({ isClickable: true })
    } else {
      button.style.cursor = 'default';
      button.style.backgroundColor = '#334646';
      button.style.color = '#AABBAA'; //this.setState({ isClickable: false })
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "EditProfile",
      id: "EditProfile",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 285,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 286,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "head",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 287,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      id: "x",
      className: "close",
      alt: "close button",
      src: _XWhite.default,
      width: "13px",
      onClick: this.handleCloseClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 288,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement("p", {
      id: "title",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 296,
        columnNumber: 13
      }
    }, "Edit profile"), /*#__PURE__*/_react.default.createElement("div", {
      id: "button-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 297,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "save-button",
      onClick: this.handleSaveClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 298,
        columnNumber: 15
      }
    }, "Save"))), /*#__PURE__*/_react.default.createElement("section", {
      id: "body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 306,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "profilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 307,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      id: "profilePic",
      account: this.props.account,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 308,
        columnNumber: 15
      }
    })), /*#__PURE__*/_react.default.createElement("form", {
      id: "form",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 313,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "edit-box",
      ref: Ref => this.nameBox = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 314,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("label", {
      id: "name",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 315,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 316,
        columnNumber: 19
      }
    }, "Name"), /*#__PURE__*/_react.default.createElement("span", {
      id: "count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 317,
        columnNumber: 19
      }
    }, this.state.nameText.length, " / 32")), /*#__PURE__*/_react.default.createElement("textarea", {
      name: "name",
      id: "name-text",
      type: "text",
      autoComplete: "off",
      placeholder: "New name",
      rows: "1",
      maxLength: "32",
      value: this.state.nameText,
      onChange: this.handleNameTextChange,
      onFocus: this.handleNameTextFocus,
      onBlur: this.handleNameTextBlur,
      ref: Ref => this.textareaName = Ref,
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 319,
        columnNumber: 17
      }
    })), this.state.flagName ? /*#__PURE__*/_react.default.createElement("div", {
      className: "flag",
      id: "name-flag",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 335,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "flag",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 336,
        columnNumber: 23
      }
    }, this.state.flagName)) : '', /*#__PURE__*/_react.default.createElement("div", {
      id: "edit-box",
      ref: Ref => this.bioBox = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 340,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("label", {
      id: "bio",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 341,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 342,
        columnNumber: 19
      }
    }, "Bio"), /*#__PURE__*/_react.default.createElement("span", {
      id: "count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 343,
        columnNumber: 19
      }
    }, this.state.bioText.length, " / 300")), /*#__PURE__*/_react.default.createElement("textarea", {
      name: "bio",
      id: "bio-text",
      type: "text",
      autoComplete: "off",
      placeholder: "New bio",
      rows: "1",
      maxLength: "300",
      value: this.state.bioText,
      onChange: this.handleBioTextChange,
      ref: Ref => this.textareaBio = Ref,
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 345,
        columnNumber: 17
      }
    })), this.state.flagBio ? /*#__PURE__*/_react.default.createElement("div", {
      className: "flag",
      id: "bio-flag",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 359,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "flag",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 360,
        columnNumber: 23
      }
    }, this.state.flagBio)) : ''))), /*#__PURE__*/_react.default.createElement("div", {
      id: "background",
      onClick: this.handleCloseClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 367,
        columnNumber: 9
      }
    }));
  }

}

var _default = EditProfile;
exports.default = _default;