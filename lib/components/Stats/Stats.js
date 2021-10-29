"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

var _react = _interopRequireDefault(require("react"));

var _ProfilePic = _interopRequireDefault(require("../ProfilePic/ProfilePic"));

var _Loader = _interopRequireDefault(require("../Loader/Loader"));

var _Helpers = require("../../resources/Libraries/Helpers");

require("./Stats.css");

var _UMEGreen = _interopRequireDefault(require("../../resources/UME-green.svg"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Stats/Stats.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Stats extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      username: '',
      address: '',
      memes: 0,
      totalLikes: 0,
      followers: 0,
      umeBalance: 0,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      ume: this.props.ume,
      statsLoading: true
    };
    this.handleToProfile = this.handleToProfile.bind(this);
  }

  async componentDidMount() {
    await this.setInfo().catch(e => console.error(e));
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToProfile(e) {
    e.preventDefault();
    this.props.handleToProfile(this.state.account);
  }

  async setInfo() {
    const username = await this.state.userStorage.methods.getName(this.state.account).call().then(elem => (0, _Helpers.fromBytes)(elem)),
          address = await this.state.userStorage.methods.getUserAddr(this.state.account).call().then(elem => (0, _Helpers.fromBytes)(elem)),
          memes = await this.state.userStorage.methods.getPostCount(this.state.account).call().then(elem => parseInt(elem)),
          totalLikes = await this.calculateLikes(),
          followers = await this.state.userStorage.methods.getFollowerCount(this.state.account).call(),
          umeBalance = await this.state.ume.methods.balanceOf(this.state.account).call().then(balance => new Intl.NumberFormat('en-IN', {}).format(balance));
    this.setState({
      username,
      address,
      memes,
      totalLikes,
      followers,
      umeBalance,
      statsLoading: false
    });
    this.props.handleBalance(umeBalance);
  }

  async calculateLikes() {
    const memeIds = await this.state.userStorage.methods.getPosts(this.state.account).call();
    let likes = 0;

    for (let i = 0; i < memeIds.length; i++) {
      likes += await this.state.memeStorage.methods.getLikeCount(memeIds[i]).call().then(likeCount => parseInt(likeCount));
    }

    return likes;
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      id: "stats-container",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 71,
        columnNumber: 7
      }
    }, this.state.statsLoading ? /*#__PURE__*/_react.default.createElement("div", {
      id: "loader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 30
      }
    })) : /*#__PURE__*/_react.default.createElement("div", {
      id: "stats",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 74,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "stats-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: this.state.address.split(1),
      onClick: this.handleToProfile,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement(_ProfilePic.default, {
      account: this.state.account,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 77,
        columnNumber: 19
      }
    })), /*#__PURE__*/_react.default.createElement("p", {
      id: "info",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 79,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: this.state.address.split(1),
      onClick: this.handleToProfile,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 80,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "username",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 81,
        columnNumber: 21
      }
    }, this.state.username)), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 83,
        columnNumber: 19
      }
    }), /*#__PURE__*/_react.default.createElement("a", {
      href: this.state.address.split(1),
      onClick: this.handleToProfile,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 84,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "address",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 85,
        columnNumber: 21
      }
    }, this.state.address)))), /*#__PURE__*/_react.default.createElement("div", {
      id: "stats-body",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 89,
        columnNumber: 15
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "stats",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 90,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 91,
        columnNumber: 19
      }
    }, "Memes: "), /*#__PURE__*/_react.default.createElement("span", {
      id: "data",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92,
        columnNumber: 19
      }
    }, this.state.memes), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 93,
        columnNumber: 19
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      id: "label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 94,
        columnNumber: 19
      }
    }, "Likes: "), /*#__PURE__*/_react.default.createElement("span", {
      id: "data",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 95,
        columnNumber: 19
      }
    }, this.state.totalLikes), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 96,
        columnNumber: 19
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      id: "label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 97,
        columnNumber: 19
      }
    }, "Followers: "), /*#__PURE__*/_react.default.createElement("span", {
      id: "data",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 98,
        columnNumber: 19
      }
    }, this.state.followers)), /*#__PURE__*/_react.default.createElement("p", {
      id: "balance",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 100,
        columnNumber: 17
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "bold-label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 101,
        columnNumber: 19
      }
    }, "UME"), /*#__PURE__*/_react.default.createElement("span", {
      id: "label",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 101,
        columnNumber: 51
      }
    }, " balance: "), /*#__PURE__*/_react.default.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 102,
        columnNumber: 19
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      id: "data",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 103,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      id: "logo",
      src: _UMEGreen.default,
      alt: "logo",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 104,
        columnNumber: 21
      }
    }), this.state.umeBalance)))));
  }

}

var _default = Stats;
exports.default = _default;