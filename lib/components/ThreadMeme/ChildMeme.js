"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.sort.js");

var _react = _interopRequireDefault(require("react"));

var _ChildThread = _interopRequireDefault(require("../Thread/ChildThread"));

var _ReplyButton = _interopRequireDefault(require("../MemeButton/ReplyButton"));

var _LikeButton = _interopRequireDefault(require("../MemeButton/LikeButton"));

var _UpvoteButton = _interopRequireDefault(require("../MemeButton/UpvoteButton"));

var _DownvoteButton = _interopRequireDefault(require("../MemeButton/DownvoteButton"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _Loader = _interopRequireDefault(require("../Loader/Loader"));

var _Helpers = require("../../resources/Libraries/Helpers");

var _Animation = require("../../resources/Libraries/Animation");

require("./ChildMeme.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/ThreadMeme/ChildMeme.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChildMeme extends _react.default.Component {
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
      chainParentId: this.props.chainParentId,
      originId: this.props.originId,
      author: this.props.author,
      isVisible: this.props.isVisible,
      visibleText: this.props.text,
      mouseOver: this.props.mouseOver,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked,
      childLoading: false,
      unpacked: false,
      inChildThread: this.props.inChildThread,
      firstChild: this.props.firstChild,
      lastChild: this.props.lastChild,
      finalChild: this.props.finalChild
    };
    this.div = /*#__PURE__*/_react.default.createRef();
    this.container = /*#__PURE__*/_react.default.createRef();
    this.reply = /*#__PURE__*/_react.default.createRef();
    this.like = /*#__PURE__*/_react.default.createRef();
    this.rememe = /*#__PURE__*/_react.default.createRef();
    this.upvote = /*#__PURE__*/_react.default.createRef();
    this.downvote = /*#__PURE__*/_react.default.createRef();
    this.childThread = /*#__PURE__*/_react.default.createRef();
    this.childParent = /*#__PURE__*/_react.default.createRef();
    this.show = /*#__PURE__*/_react.default.createRef();
    this.showContainer = /*#__PURE__*/_react.default.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonMouseOver = this.handleButtonMouseOver.bind(this);
    this.handleButtonMouseLeave = this.handleButtonMouseLeave.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleHeight = this.handleHeight.bind(this);
    this.handleMemeClick = this.handleMemeClick.bind(this);
    this.handleOverMeme = this.handleOverMeme.bind(this);
    this.handleLeaveMeme = this.handleLeaveMeme.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleOverShow = this.handleOverShow.bind(this);
    this.handleLeaveShow = this.handleLeaveShow.bind(this);
    this.handleUnpack = this.handleUnpack.bind(this);
    this.handleChildLoading = this.handleChildLoading.bind(this);
    this.handleToThread = this.handleToThread.bind(this);
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
    //prevent redundant right-border if in thread
    if (this.state.inChildThread) {
      this.childParent.style.borderRight = 'none';
    } // if not last child of a subthread or not within a subthread, makes sure top padding is proper spacing


    if (!this.state.inChildThread || !this.state.firstChild) {
      this.div.style.paddingTop = '0.5rem';
    } // sets soft border at bottom of each sub-thread


    if (this.state.responses.length === 0) {
      this.container.style.borderBottom = '0.05rem solid #667777';
    } // if in final child, makes sure container and show container don't have soft border, sets hard border for child-parent thread


    if (this.state.finalChild) {
      this.container.style.borderBottom = 'none';

      if (!this.state.inChildThread) {
        this.childParent.style.borderBottom = '0.05rem solid #AAAAAA';
      }

      if (this.showContainer.style !== undefined) {
        this.showContainer.style.borderBottom = 'none';
      }
    }

    this.mounted = true;
    await this.formatText(); //await this.userHasLiked()
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

  handleHeight() {
    this.props.handleHeight();
  }

  handleMemeClick(e) {
    e.preventDefault();

    if (e.target !== this.pfp && e.target.id !== 'profile-pic' && e.target.id !== 'username' && e.target.id !== 'at' && e.target.className !== 'reply' && e.target.className !== 'LikeButton' && e.target.className !== 'LikeButton-Liked' && e.target.className !== 'like' && e.target.className !== 'liked' && e.target.className !== 'rememe' && e.target.className !== 'upvote' && e.target.className !== 'downvote') {
      this.props.handleToThread(this.state.memeId);
    }
  }

  handleOverMeme(e) {
    e.preventDefault();
    const element = 'div#' + this.div.id;

    if (this.div.style.backgroundColor !== '#2A2A2A') {
      (0, _Animation.bgColorChange)(element, '1D1F22', '2A2A2A', 500);
    } else if (this.div.style.backgroundColor === '#2A2A2A') {
      document.querySelector(element).style.backgroundColor = '#2A2A2A';
    }

    this.props.handleOverMeme(this.div.style.backgroundColor);
  }

  handleLeaveMeme(e) {
    e.preventDefault();
    const elementName = 'div#' + this.div.id;
    (0, _Animation.bgColorChange)(elementName, '2A2A2A', '1D1F22', 500);
  }

  handleOverShow(e) {
    e.preventDefault();
    const element = 'div#' + this.show.id;

    if (this.div.style.backgroundColor !== '#2A2A2A') {
      (0, _Animation.bgColorChange)(element, '1D1F22', '2A2A2A', 500);
    } else if (this.div.style.backgroundColor === '#2A2A2A') {
      document.querySelector(element).style.backgroundColor = '#2A2A2A';
    }

    this.props.handleOverMeme(this.div.style.backgroundColor);
  }

  handleLeaveShow(e) {
    e.preventDefault();
    const elementName = 'div#' + this.show.id;
    (0, _Animation.bgColorChange)(elementName, '2A2A2A', '1D1F22', 500);
  }

  handleReply(e) {
    this.props.handleReply(e);
  }

  handleLike(e) {
    console.log(e);
    this.setState({
      userHasLiked: e[1],
      likes: e[2]
    });
    this.props.handleLike(e);
  }

  handleRememe(e) {
    console.log('rememe');
  }

  handleUnpack(e) {
    e.preventDefault();
    this.setState({
      unpacked: true
    });
  }

  handleChildLoading(childLoading) {
    this.setState({
      childLoading
    });
  }

  handleToThread(e) {
    this.props.handleToThread(e);
  }

  handleOverReply(e) {
    this.props.handleOverReply(e);
  }

  handleOverLike(e) {
    this.props.handleOverLike(e);
  }

  handleOverRememe(e) {
    this.props.handleOverRememe(e);
  }

  handleOverUpvote(e) {
    this.props.handleOverUpvote(e);
  }

  handleOverDownvote(e) {
    this.props.handleOverDownvote(e);
  }

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
            lineNumber: 273,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement(_Tag.default, {
          key: i,
          address: elem[1],
          handleTag: this.handleTag,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 275,
            columnNumber: 26
          }
        }));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("a", {
          key: i,
          href: "/".concat(elem[1]),
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 277,
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

  calculateTimePassed() {
    const ms = new Date() - Date.parse(this.state.time),
          sec = Math.floor(ms / 1000),
          min = Math.floor(ms / 60000),
          hrs = Math.floor(ms / 3600000),
          days = Math.floor(ms / 86400000),
          wks = Math.floor(ms / 604800000),
          mos = Math.floor(ms / 2592000000),
          yrs = Math.floor(ms / 31536000000);
    return yrs > 0 ? yrs + 'y' : mos > 0 ? mos + 'mo' : wks > 0 ? wks + 'w' : days > 0 ? days + 'd' : hrs > 0 ? hrs + 'h' : min > 0 ? min + 'm' : sec > 0 ? sec + 's' : 'now';
  }

  render() {
    const //rememeCountTotal = parseInt(this.state.rememeCount) + parseInt(this.state.quoteCount),
    time = this.calculateTimePassed();
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "ChildMeme-Parent",
      id: this.state.memeId,
      hfref: this.state.memeId,
      ref: Ref => this.childParent = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 313,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "ChildMeme",
      id: 'meme' + this.state.memeId,
      ref: Ref => this.div = Ref,
      onClick: this.handleMemeClick,
      onMouseEnter: this.handleOverMeme,
      onMouseLeave: this.handleLeaveMeme,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 319,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "ChildMeme-container",
      ref: Ref => this.container = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 327,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "profilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 328,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      id: "profilePic",
      href: "/".concat(this.state.address.slice(1)),
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 329,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      account: this.state.author,
      id: "ChildMeme",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 334,
        columnNumber: 17
      }
    })), this.state.responses.length ? /*#__PURE__*/_react.default.createElement("div", {
      className: "vl",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 337,
        columnNumber: 20
      }
    }) : /*#__PURE__*/_react.default.createElement("p", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 338,
        columnNumber: 20
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      id: "ChildMeme-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 341,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "ChildMeme-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 342,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: "/".concat(this.state.address.slice(1)),
      id: "username",
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 343,
        columnNumber: 17
      }
    }, this.state.username), /*#__PURE__*/_react.default.createElement("span", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 350,
        columnNumber: 17
      }
    }, this.state.address), /*#__PURE__*/_react.default.createElement("span", {
      id: "time",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 351,
        columnNumber: 17
      }
    }, time)), /*#__PURE__*/_react.default.createElement("div", {
      id: "text-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 353,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "ChildMeme-text",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 354,
        columnNumber: 17
      }
    }, this.state.visibleText)), /*#__PURE__*/_react.default.createElement("div", {
      id: "ChildMeme-footer",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 358,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement(_ReplyButton.default, {
      memeId: this.state.memeId,
      username: this.state.username,
      address: this.state.address,
      text: this.state.text,
      parentId: this.state.parentId,
      originId: this.state.originId,
      repostId: this.state.repostId,
      author: this.state.author,
      responses: this.state.responses,
      isMain: false,
      handleReply: this.handleReply,
      handleOverReply: this.handleOverReply,
      handleBanner: this.handleBanner,
      ref: Ref => this.reply = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 359,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement(_LikeButton.default, {
      memeId: this.state.memeId,
      userAccount: this.state.userAccount,
      likes: this.state.likes,
      userHasLiked: this.state.userHasLiked,
      isMain: false,
      memeStorage: this.state.memeStorage,
      interface: this.state.interface,
      handleLike: this.handleLike,
      handleOverLike: this.handleOverLike,
      handleBanner: this.handleBanner,
      ref: Ref => this.like = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 375,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement(_UpvoteButton.default, {
      memeId: this.state.memeId,
      account: this.state.userAccount,
      isMain: false,
      interface: this.state.interface,
      handleOverUpvote: this.handleOverUpvote,
      handleUpvotePopup: this.handleUpvotePopup,
      handleBanner: this.handleBanner,
      ref: Ref => this.upvote = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 407,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement(_DownvoteButton.default, {
      memeId: this.state.memeId,
      account: this.state.userAccount,
      isMain: false,
      interface: this.state.interface,
      handleOverDownvote: this.handleOverDownvote,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      ref: Ref => this.downvote = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 417,
        columnNumber: 17
      }
    }))))), this.state.responses.length === 0 ? '' : !this.state.unpacked ? /*#__PURE__*/_react.default.createElement("div", {
      id: 'show' + this.state.memeId,
      className: "show-replies",
      onClick: this.handleUnpack,
      onMouseEnter: this.handleOverShow,
      onMouseLeave: this.handleLeaveShow,
      ref: Ref => this.show = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 434,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "show-replies",
      ref: Ref => this.showContainer = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 442,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "line-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 443,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "dotted-line",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 444,
        columnNumber: 23
      }
    })), /*#__PURE__*/_react.default.createElement("p", {
      id: "show-replies",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 446,
        columnNumber: 21
      }
    }, "Show more replies"))) : this.state.childLoading ? /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 450,
        columnNumber: 21
      }
    }) : /*#__PURE__*/_react.default.createElement(_ChildThread.default, {
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      interface: this.state.interface,
      handleHeight: this.handleHeight,
      handleLoading: this.handleChildLoading,
      handleReply: this.handleReply,
      handleToProfile: this.handleToProfile,
      handleToThread: this.handleToThread,
      handleUpvotePopup: this.handleUpvotePopup,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      atBottom: this.state.atBottom,
      ref: Ref => this.childThread = Ref,
      memeId: this.state.memeId,
      memeUsername: this.state.memeUsername,
      memeAddress: this.state.memeAddress,
      text: this.state.text,
      time: this.state.time,
      responses: this.state.responses,
      likes: this.state.likes,
      likers: this.state.likers,
      rememeCount: this.state.rememeCount,
      rememes: this.state.rememes,
      quoteCount: this.state.quoteCount,
      quoteMemes: this.state.quoteMemes,
      repostId: this.state.repostId,
      parentId: this.state.parentId,
      originId: this.state.originId,
      author: this.state.author,
      isVisible: this.state.isVisible,
      visibleText: this.state.visibleText,
      userHasLiked: this.state.userHasLiked,
      userAccount: this.state.userAccount,
      firstChild: this.state.firstChild,
      lastChild: this.state.lastChild,
      finalChild: this.state.finalChild,
      unpacked: this.state.unpacked,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 451,
        columnNumber: 21
      }
    }));
  }

}

var _default = ChildMeme;
exports.default = _default;