"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.parse-int.js");

var _react = _interopRequireDefault(require("react"));

var _ChildMeme = _interopRequireDefault(require("../ThreadMeme/ChildMeme"));

var _Loader = _interopRequireDefault(require("../Loader/Loader"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./ChildThread.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Thread/ChildThread.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChildThread extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      ume: null,
      memes: [],
      memesHTML: [],
      memeId: this.props.memeId,
      parentId: this.props.parentId,
      responses: this.props.responses,

      /*
      memeUsername: this.props.memeUsername,
      memeAddress: this.props.memeAddress,
      text: this.props.text,
      time: this.props.time,
      likes: this.props.likes,
      likers: this.props.likers,
      rememeCount: this.props.rememeCount,
      rememes: this.props.rememes,
      quoteCount: this.props.quoteCount,
      quoteMemes: this.props.quoteMemes,
      repostId: this.props.repostId,
      chainParentId: this.props.chainParentId,
      originId: this.props.originId,
      author: this.props.author,
      isVisible: this.props.isVisible,
      visibleText: this.props.visibleText,
      */
      userHasLiked: this.props.userHasLiked,
      inChildThread: this.props.inChildThread,
      unpacked: this.props.unpacked,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      focusPage: 'thread',
      replyCount: null,
      repliesToRender: 50,
      repliesNotRendered: null,
      repliesRendered: null,
      loading: false,
      refreshing: false,
      contractLoading: this.props.contractLoading,
      loadingBottom: false,
      allMemesLoaded: false,
      firstLoad: true,
      sortStyle: 'boost'
    };
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleToThread = this.handleToThread.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleOverMeme = this.handleOverMeme.bind(this);
    this.handleOverButton = this.handleOverButton.bind(this);
    this.handleOverReply = this.handleOverReply.bind(this);
    this.handleOverLike = this.handleOverLike.bind(this);
    this.handleOverRememe = this.handleOverRememe.bind(this);
    this.handleOverUpvote = this.handleOverUpvote.bind(this);
    this.handleOverDownvote = this.handleOverDownvote.bind(this);
    this.handleUpvotePopup = this.handleUpvotePopup.bind(this);
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  }

  async componentDidMount() {
    clearInterval(this.intervalChildThread);

    if (this.state.firstLoad) {
      await this.loadChildThread();
    }

    this.mounted = true;
  }

  componentDidUpdate() {
    if (this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered !== 0 && !this.state.loadingBottom) {
      setTimeout(async () => {
        if (this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered !== 0 && !this.state.loadingBottom) {//await this.loadOldMemes()
        }
      }, 200);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalChildThread);
    this.mounted = false;
  }

  handleToProfile(e) {
    if (!this.state.loading) {
      this.props.handleToProfile(e);
    }
  }

  handleToThread(e) {
    if (!this.state.loading) {
      this.props.handleToThread(e);
    }
  }

  handleReply(e) {
    this.props.handleReply(e);
  }

  handleLike(e) {
    this.props.handleLike(e);
  }

  handleOverMeme(e) {}

  handleOverButton(e) {}

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
  } // to be invoked upon page load


  async loadChildThread() {
    console.log('thread: Try Load ChildThread');

    if (this.state.firstLoad) {
      this.setState({
        loading: true
      });
      this.props.handleLoading(this.state.loading);
      console.log('load thread ' + new Date().toTimeString()); // compile all meme id's

      let replyIds = await this.compileRepliesByBoost();
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            replyCount = replyIds.length,
            replies = [];
      let repliesToRender = this.state.repliesToRender,
          repliesNotRendered = replyCount - repliesToRender,
          repliesRendered = 0,
          repliesInQueue = 0; // set queue data to safe values

      if (replyCount > repliesToRender) {
        repliesNotRendered = replyCount - repliesToRender;
      } else if (replyCount <= repliesToRender) {
        repliesToRender = replyCount;
        repliesNotRendered = 0;
      }

      if (this.state.firstLoad) {
        this.setState({
          replyCount,
          //repliesNotRendered,
          replyIds
        }); // compile replies

        for (let i = 0; i < repliesToRender; i++) {
          const replyId = replyIds[repliesNotRendered + i],
                meme = await this.populateMeme(replyId, memeStorage, userStorage);
          replies.push(meme);
          repliesInQueue++;
        } //set new memes to state, sort to current sort style


        this.setState({
          replies
        });
        this.sortToStyle(); //console.log('parents ' + parents)
        //console.log('meme ' + meme)
        //console.log('replies ' + replies)

        await this.renderReplies(repliesRendered, repliesInQueue, replyCount).catch(e => console.error(e)); //console.log('parentsHTML:')
        //console.log(this.state.parentsHTML)
        //console.log('memeHTML:')
        //console.log(this.state.memeHTML)
        //console.log('repliesHTML:')
        //console.log(this.state.repliesHTML)

        repliesRendered += repliesInQueue; //console.log('first load: ' + this.state.firstLoad)

        this.setState({
          repliesNotRendered,
          repliesRendered,
          loading: false,
          firstLoad: false
        });

        if (repliesNotRendered === 0) {
          this.setState({
            allMemesLoaded: true
          });
        } //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)


        await this.props.handleLoading(this.state.loading);
      }
    } else {
      this.setState({
        loading: false
      });
      await this.props.handleLoading(this.state.loading);
    }
  }

  async refreshMemes() {
    console.log('thread: Try Refresh Memes');

    if (!this.state.loading && !this.state.loadingBottom && !this.state.refreshing) {
      console.log('refreshing memes ' + new Date().toTimeString());
      let loadedMemes = this.state.memes;
      this.setState({
        refreshing: true
      });
      await this.props.handleRefreshing(false);
      loadedMemes.forEach(async e => {
        const newResponses = await this.props.memeStorage.methods.getResponses(e.memeId).call();
        const newLikers = await this.props.memeStorage.methods.getLikers(e.memeId).call();
        const newRememes = await this.props.memeStorage.methods.getReposts(e.memeId).call();
        const newQuoteMemes = await this.props.memeStorage.methods.getQuotePosts(e.memeId).call();
        const newBoosts = await this.props.memeStorage.methods.getBoost(e.memeId).call();

        if (e.responses.length !== newResponses.length) {
          e.responses = newResponses;
        }

        if (e.likes !== newLikers.length) {
          e.likes = newLikers.length;
          e.likers = newLikers;
          e.userHasLiked = e.likers.includes(this.state.userAccount);
        }

        if (e.rememeCount !== newRememes.length) {
          e.rememeCount = newRememes.length;
          e.rememes = newRememes;
        }

        if (e.quoteCount !== newQuoteMemes.length) {
          e.quoteCount = newQuoteMemes.length;
          e.quoteMemes = newQuoteMemes;
        }

        if (e.boosts !== newBoosts) {
          e.boosts = newBoosts;
        }

        e.alreadyRendered = true;
      });
      this.sortToStyle(this.state.sortStyle);
      await this.renderReplies(loadedMemes.length, 0, loadedMemes.length).catch(e => console.error(e));
      this.setState({
        refreshing: false
      });
      await this.props.handleRefreshing(false);
    }
  } // helper functions


  async populateMeme(memeId, memeStorage, userStorage) {
    const tempMeme = await memeStorage.methods.memes(memeId).call();
    const username = await userStorage.methods.users(tempMeme.author).call().then(e => (0, _Helpers.fromBytes)(e.name)).then(e => e.toString());
    const address = await userStorage.methods.users(tempMeme.author).call().then(e => (0, _Helpers.fromBytes)(e.userAddr)).then(e => e.toString());
    const likers = await memeStorage.methods.getLikers(memeId).call();
    return {
      memeId: await memeId,
      username: await username,
      address: await address,
      text: await tempMeme.text,
      time: new Date(tempMeme.time * 1000).toLocaleString(),
      boosts: await tempMeme.boosts,
      likes: await likers.length,
      likers: await likers,
      rememeCount: await memeStorage.methods.getRepostCount(memeId).call(),
      rememes: await memeStorage.methods.getReposts(memeId).call(),
      quoteCount: await memeStorage.methods.getQuotePostCount(memeId).call(),
      quoteMemes: await memeStorage.methods.getQuotePosts(memeId).call(),
      responses: await memeStorage.methods.getResponses(memeId).call(),
      tags: await memeStorage.methods.getTags(memeId).call(),
      repostId: await tempMeme.repostId,
      parentId: await tempMeme.parentId,
      originId: await tempMeme.originId,
      author: await tempMeme.author,
      isVisible: await tempMeme.isVisible,
      //renderOrder: 0,
      alreadyRendered: false,
      userHasLiked: await likers.includes(this.state.userAccount),
      inChildThread: true
    };
  }

  async renderReplies(memesRendered, memesInQueue, memeCount) {
    const tempMemesHTML = [],
          tempMemes = this.state.replies; //    memesToRender = this.state.memesToRender,
    //memesRendered = this.state.memesRendered,
    //memeCount = this.state.memeCount

    if (memeCount > 0) {
      for (let i = 0; i < memesRendered + memesInQueue; i++) {
        const meme = tempMemes[i]; //add Meme component to temporary array

        if (meme.isVisible) {
          tempMemesHTML.unshift( /*#__PURE__*/_react.default.createElement(_ChildMeme.default, {
            key: i + 1,
            memeId: meme.memeId,
            username: meme.username,
            address: meme.address,
            text: meme.text,
            time: meme.time,
            boosts: meme.boosts,
            likes: meme.likes,
            likers: meme.likers,
            rememeCount: meme.rememeCount,
            rememes: meme.rememes,
            quoteCount: meme.quoteCount,
            quoteMemes: meme.quoteMemes,
            responses: meme.responses,
            tags: meme.tags,
            repostId: meme.repostId,
            parentId: meme.parentId,
            originId: meme.originId,
            author: meme.author,
            isVisible: meme.isVisible,
            handleToProfile: this.handleToProfile,
            handleToThread: this.handleToThread,
            handleRefresh: this.handleRefresh,
            handleReply: this.handleReply,
            handleLike: this.handleLike,
            handleOverMeme: this.handleOverMeme,
            handleOverButton: this.handleOverButton,
            handleOverReply: this.handleOverReply,
            handleOverLike: this.handleOverLike,
            handleOverRememe: this.handleOverRememe,
            handleOverUpvote: this.handleOverUpvote,
            handleOverDownvote: this.handleOverDownvote,
            handleUpvotePopup: this.handleUpvotePopup,
            handleDownvotePopup: this.handleDownvotePopup,
            handleBanner: this.handleBanner,
            interface: this.props.interface,
            memeStorage: this.props.memeStorage,
            userStorage: this.props.userStorage,
            userAccount: this.state.userAccount,
            userHasLiked: meme.userHasLiked,
            inChildThread: true,
            firstChild: i === memesRendered + memesInQueue - 1,
            lastChild: i === 0,
            finalChild: this.props.finalChild,
            __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 315,
              columnNumber: 13
            }
          }));
        }
      }
    }

    this.setState({
      repliesHTML: tempMemesHTML,
      replies: tempMemes
    }); // memesHTML to function that marks rendered memes as 'alreadyRendered', sends to oldMemesHTML
  }

  async compileRepliesByTime() {
    const memeIds = [...this.state.responses];
    return memeIds;
  }

  async compileRepliesByBoost() {
    const boostMap = [],
          memeIds = [...this.state.responses];

    for (let i = 0; i < memeIds.length; i++) {
      const meme = await this.state.memeStorage.methods.memes(memeIds[i]).call();
      boostMap.push([meme.boosts, memeIds[i], meme.time]);
    }

    boostMap.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    const memeIdsByBoost = [];
    boostMap.forEach(e => memeIdsByBoost.push(e[1])); //console.log(boostMap)

    return memeIdsByBoost;
  }

  sortToStyle(style) {
    if (style === 'time') {
      this.setState({
        replies: this.state.replies.sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
      });
    } else if (style === 'boost') {
      this.setState({
        replies: this.state.replies.sort((a, b) => a.boosts - b.boosts)
      });
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "ChildThread",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 405,
        columnNumber: 7
      }
    }, this.state.loading ? this.state.replyCount === null && !this.state.refreshing ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 408,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 409,
        columnNumber: 17
      }
    })) : this.state.loadingBottom ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 412,
        columnNumber: 17
      }
    }, this.state.repliesHTML, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 414,
        columnNumber: 19
      }
    })) : /*#__PURE__*/_react.default.createElement("div", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 416,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 417,
        columnNumber: 19
      }
    }), this.state.repliesHTML) : !this.state.refreshing ? this.state.allMemesLoaded ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loaded",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 422,
        columnNumber: 17
      }
    }, this.state.repliesHTML) : /*#__PURE__*/_react.default.createElement("div", {
      id: "loaded",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 425,
        columnNumber: 17
      }
    }, this.state.repliesHTML) : /*#__PURE__*/_react.default.createElement("div", {
      id: "loaded",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 428,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 429,
        columnNumber: 17
      }
    }, "No memes yet!")));
  }

}

var _default = ChildThread;
exports.default = _default;