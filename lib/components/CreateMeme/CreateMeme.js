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

var _Animation = require("../../resources/Libraries/Animation");

var _Helpers = require("../../resources/Libraries/Helpers");

require("./CreateMeme.css");

var _XWhite = _interopRequireDefault(require("../../resources/X-white.svg"));

var _autosize = _interopRequireDefault(require("autosize"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/CreateMeme/CreateMeme.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emptyId = '0x0000000000000000000000000000000000000000000000000000000000000000';

class CreateMeme extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingMeme: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      memeText: localStorage.getItem('memeText') !== undefined ? localStorage.getItem('memeText') : '',
      visibleText: localStorage.getItem('memeText') !== undefined ? localStorage.getItem('memeText') : '',
      flag: '',
      parentId: emptyId,
      chainParentId: emptyId,
      originId: emptyId,
      repostId: emptyId,
      validMeme: false
    };
    this.textarea = /*#__PURE__*/_react.default.createRef();
    this.textBox = /*#__PURE__*/_react.default.createRef();
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMemeClick = this.handleMemeClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const background = document.querySelector('.CreateMeme div#background'),
          container = document.querySelector('.CreateMeme div#container');
    background.style.top = this.props.offsetY + 'px';

    if (window.innerWidth < 580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY + 'px)';
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)';
    }

    const storage = localStorage.getItem('memeText');

    if (storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelectorAll('.CreateMeme p#meme-button'),
            memeButton = document.querySelectorAll('.CreateMeme p#meme-button');
      this.setState({
        memeText: this.state.memeText !== 'null' || this.state.memeText !== null ? '' : localStorage.getItem('memeText'),
        visibleText: this.state.memeText !== 'null' || this.state.memeText !== null ? '' : localStorage.getItem('memeText'),
        validMeme: true
      });
      console.log(this.textBox.clientHeight);
      memeButton.forEach(elem => {
        elem.style.backgroundColor = '#00CC89';
        elem.style.cursor = 'pointer';
      });
      buttonText.forEach(elem => elem.style.color = '#FFFFFF');
    }

    (0, _Animation.fadeIn)('.CreateMeme div#container', 333);
    (0, _Animation.partialFadeIn)('.CreateMeme div#background', 100, 0.2);
    this.textarea.focus();
    (0, _autosize.default)(this.textarea);
  }

  componentDidUpdate() {
    const container = document.querySelector('.CreateMeme div#container'),
          background = document.querySelector('.CreateMeme div#background');
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
    window.addEventListener('resize', null);
    this.mounted = false;
  }

  async handleTextChange(e) {
    e.preventDefault();
    this.setState({
      memeText: e.target.value
    });
    const text = await e.target.value,
          buttonText = document.querySelectorAll('.CreateMeme p#meme-button'),
          memeButton = document.querySelectorAll('.CreateMeme p#meme-button'),
          textBox = document.querySelector('.CreateMeme div#text-box'),
          textarea = document.querySelector('.CreateMeme textarea#meme-text');
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
            lineNumber: 132,
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
            lineNumber: 136,
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
      this.props.handleBanner(['Waiting', 'Meme', this.state.memeId + '-create-meme']);
      const tags = await this.validAts();
      await this.state.interface.methods.newMeme(this.props.account, this.state.memeText, await tags, this.state.parentId, this.state.originId).send({
        from: this.props.account
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'Meme', this.state.memeId + '-create-meme']);
        this.handleCloseClick();
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'Meme', this.state.memeId + '-create-meme']);
      }).catch(e => {
        this.props.handleBanner(['Cancel', 'Meme', this.state.memeId + '-create-meme']);
        console.error(e);
      });
      localStorage.setItem('memeText', '');
    }
  }

  async handleCloseClick(e) {
    localStorage.setItem('memeText', this.state.memeText);
    (0, _Animation.fadeOut)('.CreateMeme div#container', 500);
    (0, _Animation.partialFadeOut)('.CreateMeme div#background', 333, 0.2);
    (0, _Animation.unBlur)('div.Main', 500);
    setTimeout(async () => {
      await this.setState({
        creatingMeme: false
      });
      this.props.handleExitCreate(await this.state.creatingMeme);
    }, 500);
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
            lineNumber: 215,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "at",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 217,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 219,
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
      className: "CreateMeme",
      id: "CreateMeme",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 250,
        columnNumber: 5
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 254,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "head",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 255,
        columnNumber: 9
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
        lineNumber: 256,
        columnNumber: 11
      }
    })), /*#__PURE__*/_react.default.createElement("section", {
      id: "body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 265,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "profilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 266,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      id: "profilePic",
      account: this.props.account,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 267,
        columnNumber: 13
      }
    })), /*#__PURE__*/_react.default.createElement("form", {
      id: "form",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 272,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "text-box",
      ref: Ref => this.textBox = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 273,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("textarea", {
      name: "meme",
      id: "meme-text",
      type: "text",
      autoComplete: "off",
      placeholder: "What's the meme",
      rows: "auto",
      maxLength: "512",
      value: this.state.memeText,
      onChange: this.handleTextChange,
      ref: Ref => this.textarea = Ref,
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 274,
        columnNumber: 15
      }
    }), /*#__PURE__*/_react.default.createElement("p", {
      id: "text-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 286,
        columnNumber: 15
      }
    }, this.state.visibleText)), /*#__PURE__*/_react.default.createElement("div", {
      id: "button-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 290,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "counter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 291,
        columnNumber: 15
      }
    }, this.state.flag), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-button",
      onClick: this.handleMemeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 292,
        columnNumber: 15
      }
    }, "Meme")))), /*#__PURE__*/_react.default.createElement("div", {
      id: "button-box-small",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 301,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "counter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 302,
        columnNumber: 11
      }
    }, this.state.flag), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-button",
      onClick: this.handleMemeClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 303,
        columnNumber: 13
      }
    }, "Meme"))), /*#__PURE__*/_react.default.createElement("div", {
      id: "background",
      onClick: this.handleCloseClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 311,
        columnNumber: 9
      }
    }));
  }

}

var _default = CreateMeme;
exports.default = _default;