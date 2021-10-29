"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./ReplyMeme.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Reply/ReplyMeme.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class ReplyMeme extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      address: this.props.address,
      author: this.props.author,
      text: this.props.text,
      memeId: this.props.memeId,
      parentId: this.props.parentId,
      visibleText: this.props.text,
      replyingTo: '',
      replyChain: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked
    };
    this.div = /*#__PURE__*/_react.default.createRef();
    this.handleTag = this.handleTag.bind(this);
  } // lifecycle functions


  async componentDidMount() {
    await this.replyingTo();
    await this.formatText();
    this.mounted = true;
  }

  async componentWillUnmount() {
    this.mounted = false;
  }

  async handleTag(e) {
    const address = await (0, _Helpers.toBytes)(e),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call();

    if (account !== '0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account);
    }
  }

  async formatText() {
    let text = this.props.text,
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
            lineNumber: 60,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement("a", {
          key: i,
          href: "/".concat(elem[1].slice(1)),
          id: "at",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("a", {
          key: i,
          href: "/".concat(elem[1]),
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 26
          }
        }, elem[1]));
        i++;
      });
    }

    this.setState({
      visibleText: formatted
    });
  }

  async replyingTo() {
    let replies = [],
        hasParent = true,
        //starting values for parentId & parentAddress
    replyId = this.state.memeId,
        replyAddress = this.state.address,
        parentId = await this.state.memeStorage.methods.getParentId(replyId).call(),
        key = 1;

    while (hasParent) {
      if ((await replyId) === (await parentId)) hasParent = false;
      replies.push( /*#__PURE__*/_react.default.createElement(_Tag.default, {
        address: replyAddress,
        key: key,
        handleTag: this.handleTag,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 81,
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
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 25
          }
        }, ', '));
      }
    }

    this.setState({
      replyingTo
    });
    this.props.handleReply(this.state.replyChain);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "ReplyMeme",
      ref: Ref => this.div = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 111,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "parentProfilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 112,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      account: this.state.author,
      id: "ReplyMeme",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 115,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "vl",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 116,
        columnNumber: 11
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      id: "meme-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 118,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "meme-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 119,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      id: "username",
      href: this.state.address.slice(1),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 120,
        columnNumber: 13
      }
    }, this.state.username), /*#__PURE__*/_react.default.createElement("span", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 126,
        columnNumber: 13
      }
    }, this.state.address), /*#__PURE__*/_react.default.createElement("span", {
      id: "time",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 127,
        columnNumber: 13
      }
    }, this.state.time)), /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-text",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 129,
        columnNumber: 11
      }
    }, this.state.visibleText), /*#__PURE__*/_react.default.createElement("p", {
      id: "replying",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 132,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "replying",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 132,
        columnNumber: 28
      }
    }, "Replying to "), this.state.replyingTo)));
  }

}

var _default = ReplyMeme;
exports.default = _default;