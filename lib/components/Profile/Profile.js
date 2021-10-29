"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.sort.js");

var _react = _interopRequireDefault(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _ProfileThread = _interopRequireDefault(require("./ProfileThread"));

var _Tag = _interopRequireDefault(require("../Tag/Tag"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./Profile.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Profile/Profile.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Profile extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: this.props.account,
      profileAccount: this.props.profileAccount,
      username: '',
      address: '',
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userMemeCount: this.props.userMemeCount,
      loading: false,
      infoLoading: true,
      refreshing: false
    };
    this.profile = /*#__PURE__*/_react.default.createRef();
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleToThread = this.handleToThread.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleTag = this.handleTag.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleUpvotePopup = this.handleUpvotePopup.bind(this);
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  } // lifecycles


  async componentDidMount() {
    await this.compileProfile().catch(e => console.error(e));
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    this.props.handleLoading(false);
  } // handles


  handleToProfile(e) {
    if (!this.state.loading) {
      this.setState({
        loading: e
      });
      this.props.handleToProfile(e);
    }
  }

  handleToThread(e) {
    if (!this.state.loading) {
      this.props.handleToThread(e);
    }
  }

  handleEdit(e) {
    this.props.handleEdit([this.state.username, this.state.address, this.state.bioText]);
  }

  async handleTag(e) {
    const address = await (0, _Helpers.toBytes)(e).catch(e => console.error(e)),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call().catch(e => console.error(e));

    if (account !== '0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account);
    }
  }

  handleReply(e) {
    this.props.handleReply(e);
  }

  async handleFollow(e) {
    e.preventDefault();
    this.props.handleBanner(['Waiting', 'Follow', this.state.profileAccount + '-follow']);
    await this.state.interface.methods.followUser(this.state.userAccount, this.state.profileAccount).send({
      from: this.state.userAccount
    }).on('transactionHash', () => {
      this.props.handleBanner(['Writing', 'Follow', this.state.profileAccount + '-follow']);
    }).on('receipts', () => {
      this.props.handleBanner(['Success', 'Follow', this.state.profileAccount + '-follow']);
    }).then(() => this.compileProfile()).catch(e => {
      this.props.handleBanner(['Cancel', 'Follow', this.state.profileAccount + '-follow']);
      console.error(e);
    });
  }

  handleLoading(e) {
    this.props.handleLoading(e);
  }

  handleRefresh(e) {
    this.props.handleRefresh(e);
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

  loadNewMemes() {
    this.profile.loadNewMemes();
  }

  refreshMemes() {
    this.profile.refreshMemes();
  }

  async compileProfile() {
    const username = await this.state.userStorage.methods.getName(this.state.profileAccount).call().then(e => (0, _Helpers.fromBytes)(e)),
          address = await this.state.userStorage.methods.getUserAddr(this.state.profileAccount).call().then(e => (0, _Helpers.fromBytes)(e)),
          isFollowing = await this.state.userStorage.methods.isFollowing(this.state.userAccount, this.state.profileAccount).call(),
          isFollower = await this.state.userStorage.methods.isFollower(this.state.userAccount, this.state.profileAccount).call(),
          following = await this.state.userStorage.methods.getFollowingCount(this.state.profileAccount).call(),
          followers = await this.state.userStorage.methods.getFollowerCount(this.state.profileAccount).call(),
          bio = await this.state.userStorage.methods.users(this.state.profileAccount).call().then(e => e.bio),
          time = await this.state.userStorage.methods.users(this.state.profileAccount).call().then(e => new Date(e.time * 1000).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric'
    })),
          userMemeCount = await this.state.userStorage.methods.getPostCount(this.state.profileAccount).call();
    await this.formatText(await bio);
    this.setState({
      username,
      address,
      isFollowing,
      isFollower,
      following,
      followers,
      time,
      userMemeCount,
      bioText: bio,
      infoLoading: false
    });
  }

  async formatText(text) {
    let plainMap = await (0, _Helpers.isolatePlain)(text).catch(e => console.error(e)),
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
            lineNumber: 175,
            columnNumber: 26
          }
        }, elem[1]));else if (elem[2] === 'at') formatted.push( /*#__PURE__*/_react.default.createElement(_Tag.default, {
          key: i,
          address: elem[1],
          handleTag: this.handleTag,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 177,
            columnNumber: 26
          }
        }));else if (elem[2] === 'hash') formatted.push( /*#__PURE__*/_react.default.createElement("a", {
          key: i,
          href: "/".concat(elem[1]),
          id: "hash",
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 179,
            columnNumber: 26
          }
        }, elem[1]));
        i++;
      });
    }

    this.setState({
      bio: formatted
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "Profile",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 188,
        columnNumber: 7
      }
    }, this.state.infoLoading ? '' : /*#__PURE__*/_react.default.createElement("div", {
      id: "Profile",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 191,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 192,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "left",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 193,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      account: this.state.profileAccount,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 194,
        columnNumber: 21
      }
    }), /*#__PURE__*/_react.default.createElement("p", {
      id: "info",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 197,
        columnNumber: 21
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "username",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 198,
        columnNumber: 23
      }
    }, this.state.username), /*#__PURE__*/_react.default.createElement("span", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 199,
        columnNumber: 23
      }
    }, this.state.address))), /*#__PURE__*/_react.default.createElement("div", {
      id: "right",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 202,
        columnNumber: 19
      }
    }, this.state.profileAccount === this.state.userAccount ? /*#__PURE__*/_react.default.createElement("p", {
      id: "edit",
      onClick: this.handleEdit,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 204,
        columnNumber: 27
      }
    }, "Edit profile") : this.state.isFollower ? /*#__PURE__*/_react.default.createElement("p", {
      id: "following",
      onClick: this.handleFollow,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 211,
        columnNumber: 31
      }
    }, "Following") : /*#__PURE__*/_react.default.createElement("p", {
      id: "follow",
      onClick: this.handleFollow,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 217,
        columnNumber: 31
      }
    }, "Follow"))), /*#__PURE__*/_react.default.createElement("div", {
      id: "body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 226,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "bio",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 227,
        columnNumber: 19
      }
    }, this.state.bio), /*#__PURE__*/_react.default.createElement("span", {
      id: "time",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 228,
        columnNumber: 19
      }
    }, "Joined ", this.state.time)), /*#__PURE__*/_react.default.createElement("div", {
      id: "footer",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 230,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "following-count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 231,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 232,
        columnNumber: 21
      }
    }, this.state.following), /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 235,
        columnNumber: 21
      }
    }, " Following")), /*#__PURE__*/_react.default.createElement("p", {
      id: "follower-count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 237,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "count",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 238,
        columnNumber: 21
      }
    }, this.state.followers), this.state.followers === '1' ? /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 242,
        columnNumber: 27
      }
    }, " Follower") : /*#__PURE__*/_react.default.createElement("span", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 243,
        columnNumber: 27
      }
    }, " Followers")))), /*#__PURE__*/_react.default.createElement(_ProfileThread.default, {
      account: this.state.userAccount,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      userMemeCount: this.state.userMemeCount,
      interface: this.state.interface,
      handleLoading: this.handleLoading,
      handleRefresh: this.handleRefresh,
      contractLoading: this.props.contractLoading,
      handleToProfile: this.handleToProfile,
      handleToThread: this.handleToThread,
      handleReply: this.handleReply,
      handleUpvotePopup: this.handleUpvotePopup,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      profileUsername: this.state.profileUsername,
      profileAddress: this.state.profileAddress,
      profileAccount: this.state.profileAccount,
      atBottom: this.props.atBottom,
      ref: Ref => this.profile = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 249,
        columnNumber: 9
      }
    }));
  }

}

var _default = Profile;
exports.default = _default;