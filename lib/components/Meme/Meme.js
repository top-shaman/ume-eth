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

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _Helpers = require("../../resources/Libraries/Helpers");

var _Animation = require("../../resources/Libraries/Animation");

require("./Meme.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Meme/Meme.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Meme extends _react.default.Component {
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
      visibleText: this.props.text,
      renderOrder: this.props.renderOrder,
      alreadyRendered: this.props.alreadyRendered,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked
    };
    this.pfp = /*#__PURE__*/_react.default.createRef();
    this.div = /*#__PURE__*/_react.default.createRef();
    this.reply = /*#__PURE__*/_react.default.createRef();
    this.like = /*#__PURE__*/_react.default.createRef();
    this.rememe = /*#__PURE__*/_react.default.createRef();
    this.upvote = /*#__PURE__*/_react.default.createRef();
    this.downvote = /*#__PURE__*/_react.default.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleOverReply = this.handleOverReply.bind(this);
    this.handleOverLike = this.handleOverLike.bind(this);
    this.handleOverRememe = this.handleOverRememe.bind(this);
    this.handleOverUpvote = this.handleOverUpvote.bind(this);
    this.handleOverDownvote = this.handleOverDownvote.bind(this); //this.handleRendered = this.handleRendered.bind(this)

    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleMemeClick = this.handleMemeClick.bind(this);
    this.handleOverMeme = this.handleOverMeme.bind(this);
    this.handleLeaveMeme = this.handleLeaveMeme.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleUpvotePopup = this.handleUpvotePopup.bind(this);
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  } // lifecycle functions


  async componentDidMount() {
    //    if(!this.state.alreadyRendered) {
    //      this.div.style.zIndex = 0
    //      this.div.style.opacity = 0
    //      setTimeout(() => {
    //        fadeIn('div#\\3' + this.state.memeId + ' ', 600)
    //        zipUp('div#\\3' + this.state.memeId + ' ', 600)
    //        this.setState({ alreadyRendered: true })
    //      }, 0 )
    //    } else if(this.state.alreadyRendered) {
    //      this.div.style.opacity = 1
    //    }
    this.mounted = new AbortController();
    await this.formatText().catch(e => console.error(e));
  }

  componentWillUnmount() {
    this.mounted.abort();
  } //event handlers


  handleButtonClick(e) {
    e.preventDefault();
    this.props.handleRefresh(e);
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

  handleBanner(e) {
    this.props.handleBanner(e);
  }

  handleRendered(e) {}

  handleProfileClick(e) {
    e.preventDefault();
    localStorage.setItem('focusPage', 'profile');
    localStorage.setItem('userInfo', this.state.author);
    this.props.handleToProfile(this.state.author);
  }

  async handleTag(e) {
    const address = await (0, _Helpers.toBytes)(e).catch(e => console.error(e)),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call().catch(e => console.error(e));

    if (account !== '0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account);
    }
  }

  handleMemeClick(e) {
    e.preventDefault();

    if (e.target !== this.pfp && e.target.id !== 'profile-pic' && e.target.id !== 'username' && e.target.id !== 'at' && e.target.className !== 'reply' && e.target.className !== 'LikeButton' && e.target.className !== 'LikeButton-Liked' && e.target.className !== 'like' && e.target.className !== 'liked' && e.target.className !== 'rememe' && e.target.className !== 'upvote' && e.target.className !== 'downvote') {
      this.props.handleToThread(this.state.memeId);
    }
  }

  handleOverMeme(e) {
    e.preventDefault();
    const element = 'div#\\3' + this.state.memeId;

    if (this.div.style.backgroundColor !== '#2A2A2A') {
      (0, _Animation.bgColorChange)(element, '1D1F22', '2A2A2A', 500);
    } else if (this.div.style.backgroundColor === '#2A2A2A') {
      document.querySelector(element).style.backgroundColor = '#2A2A2A';
    }
  }

  handleLeaveMeme(e) {
    e.preventDefault();
    const elementName = 'div#\\3' + this.state.memeId;
    (0, _Animation.bgColorChange)(elementName, '2A2A2A', '1D1F22', 500);
  }

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

  handleUpvotePopup(e) {
    this.props.handleUpvotePopup(e);
  }

  handleDownvotePopup(e) {
    this.props.handleDownvotePopup(e);
  }

  async formatText() {
    let text = this.props.text,
        plainMap = await (0, _Helpers.isolatePlain)(text).catch(e => console.error(e)),
        atMap = await (0, _Helpers.isolateAt)(text).catch(e => console.error(e)),
        hashMap = await (0, _Helpers.isolateHash)(text).catch(e => console.error(e)),
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
            lineNumber: 201,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement(_Tag.default, {
          key: i,
          address: elem[1],
          handleTag: this.handleTag,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 203,
            columnNumber: 26
          }
        }));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("a", {
          key: i,
          href: "/".concat(elem[1]),
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 205,
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
      className: "Meme",
      id: this.state.memeId,
      href: this.state.memeId,
      ref: Ref => this.div = Ref,
      onClick: this.handleMemeClick,
      onMouseEnter: this.handleOverMeme,
      onMouseLeave: this.handleLeaveMeme,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 242,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "profilePic",
      ref: Ref => this.pfp = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 251,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      id: "profilePic",
      href: "/".concat(this.state.address.slice(1)),
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 255,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      account: this.state.author,
      id: "Meme",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 260,
        columnNumber: 13
      }
    }))), /*#__PURE__*/_react.default.createElement("div", {
      id: "meme-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 263,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "meme-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 264,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: "/".concat(this.state.address.slice(1)),
      id: "username",
      onClick: this.handleProfileClick,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 265,
        columnNumber: 13
      }
    }, this.state.username), /*#__PURE__*/_react.default.createElement("span", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 272,
        columnNumber: 13
      }
    }, this.state.address), /*#__PURE__*/_react.default.createElement("span", {
      id: "time",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 273,
        columnNumber: 13
      }
    }, time)), /*#__PURE__*/_react.default.createElement("div", {
      id: "text-box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 275,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "meme-text",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 276,
        columnNumber: 13
      }
    }, this.state.visibleText)), /*#__PURE__*/_react.default.createElement("div", {
      id: "meme-footer",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 280,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement(_ReplyButton.default, {
      memeId: this.state.memeId,
      username: this.state.username,
      address: this.state.address,
      text: this.state.text,
      parentId: this.state.parentId,
      originId: this.state.originId,
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
        lineNumber: 281,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement(_LikeButton.default, {
      memeId: this.state.memeId,
      userAccount: this.state.userAccount,
      likes: this.state.likes,
      userHasLiked: this.state.userHasLiked,
      isMain: false,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      handleLike: this.handleLike,
      handleOverLike: this.handleOverLike,
      handleBanner: this.handleBanner,
      ref: Ref => this.like = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 296,
        columnNumber: 13
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
        lineNumber: 328,
        columnNumber: 13
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
        lineNumber: 338,
        columnNumber: 13
      }
    }))));
  }

}

var _default = Meme;
exports.default = _default;