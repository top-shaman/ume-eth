"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.sort.js");

var _react = _interopRequireDefault(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _ReplyMeme = _interopRequireDefault(require("../Reply/ReplyMeme"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _Animation = require("../../resources/Libraries/Animation");

var _Helpers = require("../../resources/Libraries/Helpers");

require("./Reply.css");

var _XWhite = _interopRequireDefault(require("../../resources/X-white.svg"));

var _autosize = _interopRequireDefault(require("autosize"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Reply/Reply.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Reply extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      replying: true,
      account: this.props.account,
      parentUsername: this.props.username,
      parentAddress: this.props.address,
      parentAuthor: this.props.author,
      parentText: this.props.text,
      memeId: this.props.memeId,
      parentId: this.props.parentId,
      chainParentId: this.props.chainParentId,
      originId: this.props.originId,
      repostId: this.props.repostId,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      memeText: localStorage.getItem('memeText') !== null ? localStorage.getItem('memeText') : '',
      visibleText: localStorage.getItem('memeText') !== null ? localStorage.getItem('memeText') : '',
      flag: '',
      validMeme: false
    };
    this.textarea = /*#__PURE__*/_react.default.createRef();
    this.textBox = /*#__PURE__*/_react.default.createRef();
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMemeClick = this.handleMemeClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const background = document.querySelector('div#background'),
          container = document.querySelector('div#container');
    background.style.top = this.props.offsetY + 'px';
    container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)';

    if (window.innerWidth < 580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY + 'px)';
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)';
    }

    const storage = localStorage.getItem('memeText');

    if (storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelectorAll('.Reply p#meme-button'),
            memeButton = document.querySelectorAll('.Reply p#meme-button');
      this.setState({
        memeText: this.state.memeText !== null && this.state.memeText !== 'null' ? '' : localStorage.getItem('memeText'),
        visibleText: this.state.memeText !== null && this.state.memeText !== 'null' ? '' : localStorage.getItem('memeText'),
        validMeme: true
      });
      memeButton.forEach(elem => {
        elem.style.backgroundColor = '#00CC89';
        elem.style.cursor = 'pointer';
      });
      buttonText.forEach(elem => elem.style.color = '#FFFFFF');
    }

    (0, _Animation.fadeIn)('.Reply div#container', 333);
    (0, _Animation.partialFadeIn)('.Reply div#background', 100, 0.2);
    this.textarea.focus();
    (0, _autosize.default)(this.textarea);
  }

  componentDidUpdate() {
    const container = document.querySelector('.Reply div#container'),
          background = document.querySelector('div#background');
    background.style.top = this.props.offsetY + 'px';

    if (this.state.windowWidth !== window.innerWidth) {
      this.setState({
        windowWidth: window.innerWidth
      });
      this.setState({
        windowHeight: window.innerHeight
      });
    }

    if (this.state.windowWidth < 580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY + 'px)';
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)';
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async handleTextChange(e) {
    e.preventDefault();
    this.setState({
      memeText: e.target.value
    });
    const text = await e.target.value,
          buttonText = document.querySelectorAll('.Reply p#meme-button'),
          memeButton = document.querySelectorAll('.Reply p#meme-button'),
          textBox = document.querySelector('.Reply div#text-box'),
          textarea = document.querySelector('.Reply textarea#meme-text');
    textBox.style.height = textarea.clientHeight + 'px'; // check text validity

    if (text.match(/\s/g)) {
      this.setState({
        validMeme: text.length !== text.match(/\s/g).length
      });
      memeButton.forEach(elem => {
        elem.style.cursor = 'default';
        elem.style.backgroundColor = '#334646';
      });
      buttonText.forEach(elem => elem.style.color = '#AABBAA');
    } else if (text.length > 0 && text.length <= 512) {
      memeButton.forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.style.backgroundColor = '#00CC89';
      });
      buttonText.forEach(elem => elem.style.backgroundColor = '#FFFFFF');
      this.setState({
        validMeme: true
      });
    } else if (e.target.value === '') {
      memeButton.forEach(elem => {
        elem.style.cursor = 'default';
        elem.style.backgroundColor = '#334646';
      });
      buttonText.forEach(elem => elem.style.color = '#AABBAA');
      this.setState({
        validMeme: false
      });
    }

    if (this.state.validMeme) {
      memeButton.forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.style.backgroundColor = '#00CC89';
      });
      buttonText.forEach(elem => elem.style.color = '#FFFFFF');
    }

    if (text.length >= 412 && text.length < 502) {
      this.setState({
        flag: /*#__PURE__*/_react.default.createElement("p", {
          id: "flag-grey",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 141,
            columnNumber: 15
          }
        }, 512 - text.length + ' characters left')
      });
    } else if (text.length >= 502 && text.length <= 512) {
      this.setState({
        flag: /*#__PURE__*/_react.default.createElement("p", {
          id: "flag-red",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 145,
            columnNumber: 15
          }
        }, 512 - text.length + ' characters left')
      });
    } else {
      this.setState({
        flag: ''
      });
    } // change color of text if special sequence


    const formattedText = await this.formatText();
    this.setState({
      visibleText: formattedText
    });
  }

  async handleMemeClick(e) {
    if (this.state.validMeme) {
      this.props.handleBanner(['Waiting', 'Reply', this.state.memeId + '-reply']);
      const tags = await this.validAts();
      this.state.interface.methods.newMeme(this.props.account, this.state.memeText, await tags, this.state.parentId, this.state.originId).send({
        from: this.props.account
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'Reply', this.state.memeId + '-reply']);
        this.handleCloseClick(e);
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'Reply', this.state.memeId + '-reply']);
      }).catch(e => {
        this.props.handleBanner(['Cancel', 'Reply', this.state.memeId + '-reply']);
        console.error(e);
      });
      localStorage.setItem('memeText', '');
    }
  }

  async handleCloseClick(e) {
    localStorage.setItem('memeText', this.state.memeText);
    (0, _Animation.fadeOut)('.Reply div#container', 500);
    (0, _Animation.partialFadeOut)('.Reply div#background', 333, 0.2);
    (0, _Animation.unBlur)('div.Main', 500);
    setTimeout(async () => {
      await this.setState({
        replying: false
      });
      this.props.handleExitReply(await this.state.replying);
    }, 500);
  }

  handleReply(e) {
    this.setState({
      parentId: e[0],
      chainParentId: e[e.length - 1]
    }); //console.log(this.state.parentId)
    //console.log(this.state.originId)
  }

  async handleToProfile(e) {
    this.handleCloseClick(e);
    this.props.handleToProfile(e);
  }

  handleResize(ContainerSize, event) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  async formatText() {
    let text = this.state.memeText,
        plainMap = await (0, _Helpers.isolatePlain)(text),
        atMap = await (0, _Helpers.isolateAt)(text),
        hashMap = await (0, _Helpers.isolateHash)(text),
        combined = [],
        formatted = [];
    combined = plainMap.concat(atMap, hashMap).sort((a, b) => a[0] - b[0]);

    if (combined !== null) {
      let i = 0;
      combined.forEach(elem => {
        if (elem[2] === 'plain') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "plain",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 235,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "at",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 237,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 239,
            columnNumber: 26
          }
        }, elem[1]));
        i++;
      });
    }

    return formatted;
  }

  async validAts() {
    let ats = [],
        validAts = [],
        tempMap = await (0, _Helpers.isolateAt)(this.state.memeText);
    if (tempMap.length !== null) tempMap.forEach(elem => ats.push(elem[1]));

    if (ats.length > 0) {
      for (let i = 0; i < ats.length; i++) {
        let elem32 = await this.toBytes32(ats[i]);

        if (await this.state.userStorage.methods.userAddressExists(elem32).call()) {
          let address = await this.state.userStorage.methods.usersByUserAddr(elem32).call();
          validAts.push(address);
        }
      }

      return validAts;
    }

    return [];
  }

  async toBytes32(text) {
    const textBytes = await (0, _Helpers.toBytes)(text);
    return await this.state.interface.methods.bytesToBytes32(textBytes).call();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "Reply",
      id: "Reply",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 270,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 271,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "head",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 272,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      id: "x",
      className: "close",
      src: _XWhite.default,
      alt: "close button",
      width: "13px",
      onClick: this.handleCloseClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 273,
        columnNumber: 13
      }
    })), /*#__PURE__*/_react.default.createElement(_ReplyMeme.default, {
      username: this.state.parentUsername,
      address: this.state.parentAddress,
      author: this.state.parentAuthor,
      text: this.state.parentText,
      memeId: this.state.memeId,
      parentId: this.state.parentId,
      originId: this.state.originId,
      memeStorage: this.state.memeStorage,
      userStorage: this.state.userStorage,
      handleReply: this.handleReply,
      handleToProfile: this.handleToProfile,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 282,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("section", {
      id: "body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 295,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "profilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 296,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      id: "profilePic",
      account: this.state.account,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 297,
        columnNumber: 15
      }
    })), /*#__PURE__*/_react.default.createElement("form", {
      id: "form",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 302,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "text-box",
      ref: Ref => this.textBox = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 303,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("textarea", {
      name: "meme",
      id: "meme-text",
      type: "text",
      autoComplete: "off",
      placeholder: "Meme your reply",
      rows: "auto",
      maxLength: "512",
      value: this.state.memeText,
      onChange: this.handleTextChange,
      ref: Ref => this.textarea = Ref,
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 304,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement("p", {
      id: "text-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 316,
        columnNumber: 17
      }
    }, this.state.visibleText)), /*#__PURE__*/_react.default.createElement("div", {
      id: "button-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 320,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "counter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 321,
        columnNumber: 17
      }
    }, this.state.flag), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-button",
      onClick: this.handleMemeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 322,
        columnNumber: 17
      }
    }, "Reply")))), /*#__PURE__*/_react.default.createElement("div", {
      id: "button-box-small",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 331,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "counter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 332,
        columnNumber: 13
      }
    }, this.state.flag), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-button",
      onClick: this.handleMemeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 333,
        columnNumber: 13
      }
    }, "Reply"))), /*#__PURE__*/_react.default.createElement("div", {
      id: "background",
      onClick: this.handleCloseClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 341,
        columnNumber: 9
      }
    }));
  }

}

var _default = Reply;
exports.default = _default;