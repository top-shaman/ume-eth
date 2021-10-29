"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-int.js");

var _react = _interopRequireDefault(require("react"));

var _Meme = _interopRequireDefault(require("../Meme/Meme"));

var _Loader = _interopRequireDefault(require("../Loader/Loader"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./Timeline.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Timeline/Timeline.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Timeline extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      ume: null,
      memes: [],
      oldMemes: [],
      oldMemesHTML: [],
      memesHTML: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.memeStorage,
      memeCount: null,
      memesToRender: 50,
      memesNotRendered: null,
      memesRendered: null,
      loading: true,
      contractLoading: this.props.contractLoading,
      loadingBottom: false,
      refreshing: false,
      allMemesLoaded: false,
      firstLoad: true,
      sortStyle: this.props.sort
    };
    this.div = /*#__PURE__*/_react.default.createRef();
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleToThread = this.handleToThread.bind(this);
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
  }

  async componentDidMount() {
    clearInterval(this.intervalTimeline);

    if (this.state.firstLoad) {
      await this.loadTimeline();
      this.intervalTimeline = setInterval(async () => {
        if (!this.state.firstLoad && !this.state.loadingBottom) {
          await this.loadNewMemes();
          await this.refreshMemes();
        }
      }, 10000);
    }

    this.mounted = true;
  }

  componentDidUpdate() {
    if (this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered !== 0 && !this.state.loadingBottom) {
      setTimeout(async () => {
        if (this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered !== 0 && !this.state.loadingBottom) {
          await this.loadOldMemes();
        }
      }, 200);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalTimeline);
    this.props.handleLoading(false);
    this.props.handleBanner(['Cancel', 'Timeline', this.state.account]);
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

  async handleLike(event) {
    /*
    const memes = this.state.memes,
          index = memes.findIndex(element => element.memeId===event[0])
    memes[index].userHasLiked = event[1]
    memes[index].likes = event[2]
    this.setState({ memes })
    await this.renderTimeline(0)
    */
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
  } // to be invoked upon page load
  // to be invoked upon page load


  async loadTimeline() {
    console.log('timeline: Try Load Timeline');

    if (this.state.firstLoad) {
      this.setState({
        loading: true
      });
      await this.props.handleLoading(this.state.loading);
      await this.props.handleBanner(['Loading', 'Timeline', this.state.account + '-loading']);
      console.log('load timeline ' + new Date().toTimeString()); // compile all meme id's

      let memeIds;

      if (this.state.sortStyle === 'time') {
        memeIds = await this.compileMemesByTime();
      } else if (this.state.sortStyle === 'boost') {
        memeIds = await this.compileMemesByBoost();
      }

      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            memeCount = memeIds.length,
            newMemes = [];
      let memesToRender = this.state.memesToRender,
          memesNotRendered = memeCount - memesToRender,
          memesRendered = 0,
          memesInQueue = 0; // set queue data to safe values

      if (memeCount > memesToRender) {
        memesNotRendered = memeCount - memesToRender;
      } else if (memeCount <= memesToRender) {
        memesToRender = memeCount;
        memesNotRendered = 0;
      }

      if (this.state.firstLoad) {
        this.setState({
          memeCount,
          memesNotRendered,
          memeIds
        });

        for (let i = 0; i < memesToRender; i++) {
          const memeId = memeIds[memesNotRendered + i],
                meme = await this.populateMeme(memeId, memeStorage, userStorage);
          newMemes.push(meme);
          memesInQueue++;
        } //set new memes to state, sort to current sort style


        this.setState({
          memes: newMemes
        });
        if (this.state.sortStyle !== 'time') this.sortToStyle(this.state.sortStyle); // render memes to HTML & store in oldMemesHTML for refresh

        await this.renderTimeline(memesInQueue).catch(e => console.error(e));
        memesRendered += memesInQueue; //console.log('first load: ' + this.state.firstLoad)

        this.setState({
          memesNotRendered,
          memesRendered,
          loading: false,
          firstLoad: false
        });

        if (memesNotRendered === 0) {
          this.setState({
            allMemesLoaded: true
          });
        } //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)


        await this.props.handleBanner(['Success', 'Timeline', this.state.account + '-loading']);
        await this.props.handleLoading(this.state.loading);
      } else {
        this.setState({
          loading: false
        });
        await this.props.handleLoading(this.state.loading);
      }
    }
  } // Timeline by Time sort
  //loads new memes above rendered section


  async loadNewMemes() {
    console.log('timeline: Try Loading New Memes');

    if (!this.state.firstLoad && !this.state.loadingBottom && !this.state.refreshing) {
      console.log('loading new memes' + new Date().toTimeString()); // compile all memes, including new memes

      const memeIds = await this.compileMemesByTime(),
            memeCount = await memeIds.length,
            countDifference = (await memeCount) - this.state.memeCount; // see if there are any new memes, i.e. if countDifference greater than 0

      if (countDifference > 0) {
        //begin loading if conditional met
        this.setState({
          loading: true
        });
        await this.props.handleLoading(this.state.loading);
        const userStorage = await this.props.userStorage,
              memeStorage = await this.props.memeStorage;
        let memesNotRendered = await this.state.memesNotRendered,
            memesRendered = await this.state.memesRendered,
            memesInQueue = 0,
            newMemes = []; // add new memes to total of memes not yet rendered

        memesNotRendered += countDifference;
        this.setState({
          allMemesLoaded: false,
          memeCount,
          memeIds
        }); // populate new memes

        for (let i = 0; i < countDifference; i++) {
          const memeId = memeIds[memeCount - countDifference + i]; //console.log('meme Id: ' + memeId)

          const meme = await this.populateMeme(memeId, memeStorage, userStorage);
          newMemes.push(meme);
          memesInQueue++;
        } // update state with new memes & replace current memesHTML with old memesHTML, while new HTML loads


        this.setState({
          memes: this.state.memes.concat(newMemes)
        });
        if (this.state.sortStyle !== 'time') this.sortToStyle(this.state.sortStyle); // render new HTML

        await this.renderTimeline(memesInQueue).catch(e => console.error(e)); // update queue values

        memesRendered += memesInQueue;
        memesNotRendered -= memesInQueue;
        this.setState({
          memeIds: memeIds,
          memesNotRendered,
          memesRendered,
          loading: false
        });

        if (memesNotRendered === 0) {
          this.setState({
            allMemesLoaded: true
          });
        } //console.log('load new memes')
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)


        await this.props.handleLoading(this.state.loading);
      } else {
        this.setState({
          loading: false
        });
        await this.props.handleLoading(this.state.loading);
      }
    }
  } // loads old memes below timeline section


  async loadOldMemes() {
    console.log('timeline: Try Load Old Memes');

    if (!this.state.firstLoad && this.props.atBottom && !this.state.loadingBottom && !this.state.refreshing) {
      this.setState({
        loadingBottom: true
      });
      console.log('load old memes ' + new Date().toTimeString());
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            memeIds = await this.state.memeIds,
            memeCount = await memeIds.length,
            newMemes = [];
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          memesRendered = await this.state.memesRendered,
          memesInQueue = 0; // set memes to render to safe value

      if (memesNotRendered - memesToRender <= 0) {
        memesToRender = memesNotRendered;
      } //console.log('memes rendered: ' + memesRendered)
      //console.log('old memes to render: ' + memesToRender)
      //console.log('old memes not yet rendered: ' + memesNotRendered)


      if (memesToRender !== 0) {
        this.setState({
          allMemesLoaded: false,
          loading: true,
          memeCount
        });
        await this.props.handleLoading(this.state.loading);

        for (let i = 0; i < memesToRender; i++) {
          const memeId = memeIds[memesNotRendered - memesToRender + i],
                meme = await this.populateMeme(memeId, memeStorage, userStorage);
          newMemes.push(meme);
          memesInQueue++;
        }

        this.setState({
          memes: newMemes.concat(this.state.memes)
        });
        if (this.state.sortStyle !== 'time') this.sortToStyle(this.state.sortStyle); // sorting functionality

        await this.renderTimeline(memesInQueue).catch(e => console.error(e));
        memesRendered += memesInQueue;
        memesNotRendered -= memesInQueue;
        this.setState({
          memesNotRendered,
          memesRendered,
          loading: false,
          loadingBottom: false
        });

        if (memesNotRendered === 0) {
          this.setState({
            allMemesLoaded: true
          });
        }

        console.log('load old memes:');
        console.log('total memes: ' + memeCount);
        console.log('memes rendered: ' + memesRendered);
        console.log('memes not yet rendered: ' + memesNotRendered);
        await this.props.handleLoading(this.state.loading);
      } else {
        this.setState({
          loading: false,
          loadingBottom: false
        });
        await this.props.handleLoading(this.state.loading);
      }
    }
  }

  async refreshMemes() {
    console.log('timeline: Try Refresh Memes');

    if (!this.state.loading && !this.state.loadingBottom && !this.state.refreshing) {
      console.log('refreshing memes ' + new Date().toTimeString());
      let loadedMemes = this.state.memes;
      this.setState({
        refreshing: true
      });
      await this.props.handleRefresh(this.state.refreshing);
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
          e.userHasLiked = e.likers.includes(this.props.account);
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
      });
      this.sortToStyle(this.state.sortStyle);
      await this.renderTimeline(0).catch(e => console.error(e));
      this.setState({
        refreshing: false
      });
      await this.props.handleRefresh(this.state.refreshing);
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
      userHasLiked: await likers.includes(this.props.account)
    };
  }

  async renderTimeline(memesInQueue) {
    const tempMemesHTML = [],
          tempMemes = this.state.memes,
          //    memesToRender = this.state.memesToRender,
    memesRendered = this.state.memesRendered,
          memeCount = this.state.memeCount;

    if (memeCount > 0) {
      let meme;

      for (let i = 0; i < memesRendered + memesInQueue; i++) {
        meme = tempMemes[i]; //add Meme component to temporary array

        if (meme.isVisible) {
          tempMemesHTML.unshift( /*#__PURE__*/_react.default.createElement(_Meme.default, {
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
            chainParentId: meme.chainParentId,
            originId: meme.originId,
            author: meme.author,
            isVisible: meme.isVisible,
            isMain: false,
            handleToProfile: this.handleToProfile,
            handleToThread: this.handleToThread,
            handleRefresh: this.handleRefresh,
            handleReply: this.handleReply,
            handleLike: this.handleLike,
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
            userAccount: this.state.account,
            userHasLiked: meme.userHasLiked,
            __self: this,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 441,
              columnNumber: 13
            }
          }));
        }
      }
    }

    this.setState({
      memesHTML: tempMemesHTML,
      memes: tempMemes
    });
  }

  async compileMemesByTime() {
    const memeIds = [...(await this.props.memeStorage.methods.getEncodedIds().call())];
    return memeIds;
  }

  async compileMemesByBoost() {
    const boostMap = [],
          memeIds = [...(await this.props.memeStorage.methods.getEncodedIds().call())];

    for (let i = 0; i < memeIds.length; i++) {
      const meme = await this.props.memeStorage.methods.memes(memeIds[i]).call();
      boostMap.push([meme.boosts, memeIds[i], meme.time]);
    }

    boostMap.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    const memeIdsByBoost = [];
    boostMap.forEach(e => memeIdsByBoost.push(e[1]));
    return memeIdsByBoost;
  }

  sortToStyle(style) {
    if (style === 'time') {
      this.setState({
        memes: this.state.memes.sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
      });
    } else if (style === 'boost') {
      this.setState({
        memes: this.state.memes.sort((a, b) => a.boosts - b.boosts)
      });
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "Timeline",
      ref: Ref => this.div = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 525,
        columnNumber: 7
      }
    }, this.state.loading ? this.state.memeCount === null && !this.state.refreshing ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 528,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 529,
        columnNumber: 17
      }
    })) : this.state.loadingBottom ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loader-bottom",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 532,
        columnNumber: 17
      }
    }, this.state.memesHTML, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 534,
        columnNumber: 19
      }
    })) : /*#__PURE__*/_react.default.createElement("div", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 536,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 537,
        columnNumber: 19
      }
    }), this.state.memesHTML) : this.state.memeCount > 0 ? this.state.allMemesLoaded ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loaded",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 542,
        columnNumber: 17
      }
    }, this.state.memesHTML, /*#__PURE__*/_react.default.createElement("p", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 544,
        columnNumber: 19
      }
    }, "All memes loaded!", /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 544,
        columnNumber: 51
      }
    }))) : /*#__PURE__*/_react.default.createElement("div", {
      id: "loaded",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 546,
        columnNumber: 17
      }
    }, this.state.memesHTML) : /*#__PURE__*/_react.default.createElement("div", {
      id: "loaded",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 549,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 550,
        columnNumber: 17
      }
    }, "No memes yet!")));
  }

}

var _default = Timeline;
exports.default = _default;