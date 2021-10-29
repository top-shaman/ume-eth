"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.sort.js");

var _react = _interopRequireDefault(require("react"));

var _ReplyButton = _interopRequireDefault(require("../MemeButton/ReplyButton"));

var _LikeButton = _interopRequireDefault(require("../MemeButton/LikeButton"));

var _UpvoteButton = _interopRequireDefault(require("../MemeButton/UpvoteButton"));

var _DownvoteButton = _interopRequireDefault(require("../MemeButton/DownvoteButton"));

var _ReplyInThread = _interopRequireDefault(require("../ReplyInThread/ReplyInThread"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./ThreadMemeMain.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/ThreadMeme/ThreadMemeMain.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThreadMemeMain extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeId: this.props.memeId,
      username: this.props.username,
      address: this.props.address,
      text: this.props.text,
      time: this.props.time,
      boosts: this.props.boosts,
      likes: this.props.likes,
      likers: this.props.likers,
      rememeCount: this.props.rememeCount,
      rememes: this.props.rememes,
      quoteCount: this.props.quoteCount,
      quoteMemes: this.props.quoteMemes,
      responses: this.props.responses,
      tags: this.props.tags,
      repostId: this.props.repostId,
      parentId: this.props.parentId,
      originId: this.props.originId,
      author: this.props.author,
      isVisible: this.props.isVisible,
      isMain: this.props.isMain,
      visibleText: this.props.text,
      renderOrder: this.props.renderOrder,
      alreadyRendered: this.props.alreadyRendered,
      mouseOver: this.props.mouseOver,
      interface: this.props.interface,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked
    };
    this.div = /*#__PURE__*/_react.default.createRef();
    this.reply = /*#__PURE__*/_react.default.createRef();
    this.like = /*#__PURE__*/_react.default.createRef();
    this.rememe = /*#__PURE__*/_react.default.createRef();
    this.upvote = /*#__PURE__*/_react.default.createRef();
    this.downvote = /*#__PURE__*/_react.default.createRef();
    this.pfp = /*#__PURE__*/_react.default.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonMouseOver = this.handleButtonMouseOver.bind(this);
    this.handleButtonMouseLeave = this.handleButtonMouseLeave.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleReplyThread = this.handleReplyThread.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleOverReply = this.handleOverReply.bind(this);
    this.handleOverLike = this.handleOverLike.bind(this);
    this.handleOverRememe = this.handleOverRememe.bind(this);
    this.handleOverUpvote = this.handleOverUpvote.bind(this);
    this.handleOverDownvote = this.handleOverDownvote.bind(this);
    this.handleUpvotePopup = this.handleUpvotePopup.bind(this);
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  } // lifecycle functions


  async componentDidMount() {
    this.mounted = true; // changes color of bottom border if main meme has replies

    if (this.state.responses.length > 0) {
      //change reply margin size from default
      this.div.style.borderBottom = 'none';
    } // adjust header size if main meme has parents


    if (this.state.parentId !== this.state.memeId) {
      const header = document.querySelector('div#ThreadMemeMain-header');
      header.style.margin = '0 1rem 0.5rem 0.687rem';
    }

    await this.formatText(); //await this.userHasLiked()

    if (this.state.parentId !== this.state.memeId) {
      this.pfp.style.marginTop = '0';
    }
  }

  async componentWillUnmount() {
    this.mounted = false;
  } //event handlers


  handleButtonClick(e) {
    e.preventDefault();
    this.props.handleRefresh(e);
  }

  handleButtonMouseOver(e) {
    this.props.handleOverButton(this.div.style.filter);
  }

  handleButtonMouseLeave(e) {}

  handleProfileClick(e) {
    console.log(e);
    e.preventDefault();
    this.props.handleToProfile(this.state.author);
    localStorage.setItem('focusPage', 'profile');
    localStorage.setItem('userInfo', this.state.author);
  }

  handleToProfile(e) {
    this.props.handleToProfile(e);
  }

  async handleTag(e) {
    const address = await (0, _Helpers.toBytes)(e),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call();

    if (account !== '0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account);
    }
  }

  handleReplyThread(e) {}

  handleReply(e) {
    this.props.handleReply(e);
  }

  handleLike(e) {
    this.setState({
      userHasLiked: e[1],
      likes: e[2]
    });
    this.props.handleLike(e);
  }

  handleRememe(e) {
    console.log('rememe');
  }

  handleOverReply(e) {}

  handleOverLike(e) {}

  handleOverRememe(e) {}

  handleOverUpvote(e) {}

  handleOverDownvote(e) {}

  handleUpvotePopup(e) {
    this.props.handleUpvotePopup(e);
  }

  handleDownvotePopup(e) {
    this.props.handleDownvotePopup(e);
  }

  handleBanner(e) {
    this.props.handleBanner(e);
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
            lineNumber: 179,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement(_Tag.default, {
          key: i,
          address: elem[1],
          handleTag: this.handleTag,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 181,
            columnNumber: 26
          }
        }));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("a", {
          key: i,
          href: "/".concat(elem[1]),
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 183,
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

  render() {
    const time = new Date(this.state.time).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    }),
          date = new Date(this.state.time).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }); //rememeCountTotal = parseInt(this.state.rememeCount) + parseInt(this.state.quoteCount)

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "ThreadMemeMain",
      id: this.state.memeId,
      ref: Ref => this.div = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 195,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      className: "ThreadMemeMain",
      id: "MainMeme",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 200,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "ThreadMemeMain-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 204,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "ThreadMemeMain-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 205,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "profilePic-main",
      ref: Ref => this.pfp = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 206,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      id: "profilePic",
      href: "/".concat(this.state.address.slice(1)),
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 210,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      account: this.state.author,
      id: "ThreadMemeMain",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 215,
        columnNumber: 19
      }
    }))), /*#__PURE__*/_react.default.createElement("section", {
      id: "info",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 218,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "username",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 219,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: "/".concat(this.state.address.slice(1)),
      id: "username",
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 220,
        columnNumber: 19
      }
    }, this.state.username)), /*#__PURE__*/_react.default.createElement("span", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 228,
        columnNumber: 17
      }
    }, this.state.address))), /*#__PURE__*/_react.default.createElement("div", {
      id: "text-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 231,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "ThreadMemeMain-text",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 232,
        columnNumber: 15
      }
    }, this.state.visibleText)), /*#__PURE__*/_react.default.createElement("div", {
      id: "time",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 236,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "time",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 237,
        columnNumber: 15
      }
    }, time + ' • ' + date)), this.state.likes > 0 || this.state.rememes > 0 ? /*#__PURE__*/_react.default.createElement("div", {
      id: "stats",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 240,
        columnNumber: 19
      }
    }, this.state.likes ? /*#__PURE__*/_react.default.createElement("p", {
      id: "like-stats",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 242,
        columnNumber: 25
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "like-count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 243,
        columnNumber: 27
      }
    }, this.state.likes), /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 243,
        columnNumber: 74
      }
    }, " Likes")) : '') : '', /*#__PURE__*/_react.default.createElement("div", {
      id: "ThreadMemeMain-footer",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 250,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement(_ReplyButton.default, {
      memeId: this.state.memeId,
      username: this.state.username,
      address: this.state.address,
      text: this.state.text,
      parentId: this.state.parentId,
      originId: this.state.originId,
      author: this.state.author,
      isMain: true,
      reponses: this.state.responses,
      handleReply: this.handleReply,
      handleOverReply: this.handleOverReply,
      handleBanner: this.handleBanner,
      ref: Ref => this.reply = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 251,
        columnNumber: 15
      }
    }), /*#__PURE__*/_react.default.createElement(_LikeButton.default, {
      memeId: this.state.memeId,
      userAccount: this.state.userAccount,
      likes: this.state.likes,
      userHasLiked: this.state.userHasLiked,
      isMain: true,
      memeStorage: this.state.memeStorage,
      interface: this.state.interface,
      handleLike: this.handleLike,
      handleOverLike: this.handleOverLike,
      handleBanner: this.handleBanner,
      ref: Ref => this.like = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 266,
        columnNumber: 15
      }
    }), /*#__PURE__*/_react.default.createElement(_UpvoteButton.default, {
      memeId: this.state.memeId,
      account: this.state.userAccount,
      isMain: true,
      interface: this.state.interface,
      handleOverUpvote: this.handleOverUpvote,
      handleUpvotePopup: this.handleUpvotePopup,
      handleBanner: this.handleBanner,
      ref: Ref => this.upvote = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 298,
        columnNumber: 15
      }
    }), /*#__PURE__*/_react.default.createElement(_DownvoteButton.default, {
      memeId: this.state.memeId,
      account: this.state.userAccount,
      isMain: true,
      interface: this.state.interface,
      handleOver: this.handleButtonMouseOver,
      handleOverDownvote: this.handleOverDownvote,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      ref: Ref => this.downvote = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 308,
        columnNumber: 15
      }
    })))), /*#__PURE__*/_react.default.createElement(_ReplyInThread.default, {
      userAccount: this.state.userAccount,
      username: this.state.username,
      address: this.state.address,
      author: this.state.author,
      text: this.state.text,
      responses: this.state.responses,
      memeId: this.state.memeId,
      parentId: this.state.parentId,
      originId: this.state.originId,
      repostId: this.state.repostId,
      handleExitReply: this.handleExitReply,
      handleReplyThread: this.handleReplyThread,
      handleToProfile: this.handleToProfile,
      handleBanner: this.handleBanner,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      interface: this.state.interface,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 323,
        columnNumber: 9
      }
    }));
  }

}

var _default = ThreadMemeMain;
exports.default = _default;