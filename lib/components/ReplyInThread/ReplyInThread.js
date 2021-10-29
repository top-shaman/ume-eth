"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireDefault(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./ReplyInThread.css");

var _autosize = _interopRequireDefault(require("autosize"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/ReplyInThread/ReplyInThread.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ReplyInThread extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingMeme: true,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      memeText: localStorage.getItem('memeText') !== undefined ? localStorage.getItem('memeText') : '',
      visibleText: localStorage.getItem('memeText') !== undefined ? localStorage.getItem('memeText') : '',
      responses: this.props.responses,
      flagText: '',
      flag: '',
      replyingTo: [],
      replyChain: [],
      parentId: this.props.parentId,
      chainParentId: this.props.chainParentId,
      originId: this.props.originId,
      repostId: this.props.repostId,
      validMeme: false
    };
    this.div = /*#__PURE__*/_react.default.createRef();
    this.body = /*#__PURE__*/_react.default.createRef();
    this.textarea = /*#__PURE__*/_react.default.createRef();
    this.textBox = /*#__PURE__*/_react.default.createRef();
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleReplyClick = this.handleReplyClick.bind(this);
    this.handleTag = this.handleTag.bind(this);
  }

  componentDidMount() {
    const storage = localStorage.getItem('memeText');
    console.log(storage);

    if (storage !== null && storage !== '' && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('.ReplyInThread p#reply-submit'),
            memeButton = document.querySelector('.ReplyInThread p#reply-submit');
      this.setState({
        memeText: storage,
        visibleText: storage,
        validMeme: true
      });
      memeButton.style.backgroundColor = '#00CC89';
      memeButton.style.cursor = 'pointer';
      buttonText.style.color = '#FFFFFF';
    } else {
      this.setState({
        memeText: '',
        visibleText: '',
        validMeme: false
      });
    }

    if (this.state.responses.length > 0) {
      this.div.style.margin = '0 1rem';
      this.div.style.paddingBottom = '1rem';
      this.div.style.borderBottom = '0.05rem solid #667777';
    }

    if (this.state.memeText === '') {
      this.textBox.style.marginTop = '0.3rem';
      this.body.style.height = '1.1rem';
    }

    this.replyingTo(); //this.textarea.focus()

    (0, _autosize.default)(this.textarea);
  }

  componentDidUpdate() {
    if (this.state.memeText.length > 0) {
      this.textarea.style.width = 'inherit';
      this.body.style.height = 'auto';
    } else if (document.activeElement === this.textarea && this.state.memeText.length === 0) {
      this.textarea.style.width = '100%';
    } else {
      this.body.style.height = '1.3rem';
    }
  }

  componentWillUnmount() {}

  async handleTextChange(e) {
    e.preventDefault();
    this.setState({
      memeText: e.target.value
    });
    const text = await e.target.value,
          buttonText = document.querySelector('.ReplyInThread p#reply-submit'),
          memeButton = document.querySelector('.ReplyInThread p#reply-submit'),
          textBox = document.querySelector('.ReplyInThread div#reply-text-box'),
          textarea = document.querySelector('.ReplyInThread textarea#reply-text');
    textBox.style.height = textarea.clientHeight + 'px'; // check text validity

    if (text.match(/\s/g)) {
      this.setState({
        validMeme: text.length !== text.match(/\s/g).length
      });
      memeButton.style.cursor = 'default';
      memeButton.style.backgroundColor = '#334646';
      buttonText.style.color = '#AABBAA';
    } else if (text.length > 0 && text.length <= 512) {
      memeButton.style.cursor = 'pointer';
      memeButton.style.backgroundColor = '#00CC89';
      buttonText.style.backgroundColor = '#FFFFFF';
      this.setState({
        validMeme: true
      });
    } else if (e.target.value === '') {
      memeButton.style.cursor = 'default';
      memeButton.style.backgroundColor = '#334646';
      buttonText.style.color = '#AABBAA';
      this.setState({
        validMeme: false
      });
    }

    if (this.state.validMeme) {
      memeButton.style.cursor = 'pointer';
      memeButton.style.backgroundColor = '#00CC89';
      buttonText.style.color = '#FFFFFF';
    }

    if (this.state.validMeme) {
      memeButton.style.cursor = 'pointer';
      memeButton.style.backgroundColor = '#00CC8    9';
      buttonText.style.color = '#FFFFFF';
    }

    if (text.length >= 412 && text.length < 502) {
      this.setState({
        flagText: 512 - text.length + ' characters left'
      });
      this.setState({
        flag: /*#__PURE__*/_react.default.createElement("p", {
          id: "flag-grey",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 15
          }
        }, this.state.flagText)
      });
    } else if (text.length >= 502 && text.length <= 512) {
      this.setState({
        flagText: 512 - text.length + ' characters left'
      });
      this.setState({
        flag: /*#__PURE__*/_react.default.createElement("p", {
          id: "flag-red",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 141,
            columnNumber: 15
          }
        }, this.state.flagText)
      });
    } else {
      this.setState({
        flag: ''
      });
    }

    if (window.innerWidth < 465) {
      this.setState({
        flagText: this.state.flagText.split(' ')[0]
      });
    } // change color of text if special sequence


    const formattedText = await this.formatText();
    this.setState({
      visibleText: formattedText
    });
    localStorage.setItem('memeText', this.state.memeText);
  }

  async handleReplyClick(e) {
    if (this.state.validMeme) {
      this.props.handleBanner(['Waiting', 'Meme', this.state.memeId + '-reply-thread']);
      const tags = await this.validAts();
      this.state.interface.methods.newMeme(this.props.userAccount, this.state.memeText, await tags, this.state.parentId, this.state.originId).send({
        from: this.props.userAccount
      }).on('transactionHash', () => {
        this.props.handleBanner(['Writing', 'Meme', this.state.memeId + '-reply-thread']);
      }).on('receipt', () => {
        this.props.handleBanner(['Success', 'Meme', this.state.memeId + '-reply-thread']);
      }).catch(e => {
        this.props.handleBanner(['Cancel', 'Meme', this.state.memeId + '-reply-thread']);
        console.error(e);
      });
      localStorage.setItem('memeText', '');
    }
  }

  async handleTag(e) {
    const address = await (0, _Helpers.toBytes)(e),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call();
    console.log(address);

    if (account !== '0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account);
    }
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
            lineNumber: 218,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "at",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 220,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("span", {
          key: i,
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 222,
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

  async replyingTo() {
    let replies = [],
        hasParent = true,
        //starting values for parentId & parentAddress
    replyId = this.props.memeId,
        replyAddress = this.props.address,
        parentId = await this.state.memeStorage.methods.getParentId(replyId).call(),
        key = 1;

    while (hasParent) {
      if ((await replyId) === (await parentId)) hasParent = false;
      replies.push( /*#__PURE__*/_react.default.createElement(_Tag.default, {
        key: key,
        address: replyAddress,
        handleTag: this.handleTag,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 262,
          columnNumber: 20
        }
      }));
      this.setState({
        replyChain: [...this.state.replyChain, await replyId]
      });
      replyId = parentId;
      replyAddress = await this.state.userStorage.methods.usersByMeme(replyId).call().then(e => this.state.userStorage.methods.getUserAddr(e).call()).then(e => (0, _Helpers.fromBytes)(e));
      parentId = await this.state.memeStorage.methods.getParentId(replyId).call();
      key++;
    }

    replies = replies.filter((elem, index) => {
      if (replies[index + 1] !== undefined) {
        return elem.props.children !== replies[index + 1].props.children;
      } else return true;
    });
    let replyingTo = [],
        numReplies = replies.length;

    for (let i = 0; i < numReplies; i++) {
      replyingTo.push(replies[i]);

      if (i !== numReplies - 1) {
        replyingTo.push( /*#__PURE__*/_react.default.createElement("span", {
          id: "replying",
          key: i,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 283,
            columnNumber: 25
          }
        }, ', '));
      }
    }

    this.setState({
      replyingTo,
      parentId: this.state.replyChain[0],
      chainParentId: this.state.replyChain[this.state.replyChain.length - 1],
      originId: this.state.originId
    });
    this.props.handleReplyThread(this.state.replyChain);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "ReplyInThread",
      id: "ReplyInThread",
      ref: Ref => this.div = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 297,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "reply-container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 298,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "reply-body",
      ref: Ref => this.body = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 299,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "reply-profilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 300,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      id: "profilePic",
      account: this.props.userAccount,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 301,
        columnNumber: 15
      }
    })), /*#__PURE__*/_react.default.createElement("form", {
      id: "reply-form",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 306,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "reply-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 307,
        columnNumber: 15
      }
    }, document.activeElement === this.textarea ? /*#__PURE__*/_react.default.createElement("p", {
      id: "replying",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 309,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "replying",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 309,
        columnNumber: 38
      }
    }, "Replying to "), this.state.replyingTo) : /*#__PURE__*/_react.default.createElement("p", {
      id: "replying",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 310,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "replying",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 310,
        columnNumber: 38
      }
    }))), /*#__PURE__*/_react.default.createElement("div", {
      id: "reply-text-box",
      ref: Ref => this.textBox = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 314,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("textarea", {
      name: "meme",
      id: "reply-text",
      type: "text",
      autoComplete: "off",
      placeholder: "Meme your reply",
      rows: "1",
      maxLength: "512",
      value: this.state.memeText,
      onChange: this.handleTextChange,
      ref: Ref => this.textarea = Ref,
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 315,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement("p", {
      id: "text-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 327,
        columnNumber: 17
      }
    }, this.state.visibleText)))), /*#__PURE__*/_react.default.createElement("div", {
      id: "reply-button-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 333,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "counter",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 334,
        columnNumber: 13
      }
    }, this.state.flag), /*#__PURE__*/_react.default.createElement("p", {
      id: "reply-submit",
      onClick: this.handleReplyClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 335,
        columnNumber: 13
      }
    }, "Reply"))));
  }

}

var _default = ReplyInThread;
exports.default = _default;