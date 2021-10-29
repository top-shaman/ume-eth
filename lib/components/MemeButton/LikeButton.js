"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.includes.js");

var _react = _interopRequireDefault(require("react"));

var _Animation = require("../../resources/Libraries/Animation");

var _heart = _interopRequireDefault(require("../../resources/heart.svg"));

var _heartFilled = _interopRequireDefault(require("../../resources/heart-filled.svg"));

require("./LikeButton.css");

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/MemeButton/LikeButton.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LikeButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      memeId: this.props.memeId,
      userAccount: this.props.userAccount,
      likes: this.props.likes,
      isMain: this.props.isMain,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      userHasLiked: this.props.userHasLiked
    };
    this.like = /*#__PURE__*/_react.default.createRef();
    this.liked = /*#__PURE__*/_react.default.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnterLike = this.handleMouseEnterLike.bind(this);
    this.handleMouseLeaveLike = this.handleMouseLeaveLike.bind(this);
    this.handleMouseEnterLiked = this.handleMouseEnterLiked.bind(this);
    this.handleMouseLeaveLiked = this.handleMouseLeaveLiked.bind(this);
  }

  async componentDidMount() {
    if (this.state.userHasLiked) {
      this.liked.style.filter = 'invert(0) sepia(1) brightness(0.4    ) saturate(10000%) hue-rotate(285deg)';
    }

    this.mounted = true;
    await this.userHasLiked();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async handleClick(e) {
    if (!this.state.userHasLiked) {
      (0, _Animation.bobble)('#' + this.like.id, 500);
    } else {
      (0, _Animation.bobble)('#' + this.liked.id, 500);
    }

    await this.likeClick();
  }

  handleMouseEnterLike(e) {
    e.preventDefault();
    let brightnessStart = 0.7,
        brightnessEnd = 0.4,
        hue = 285,
        elementName = '#' + this.like.id;
    (0, _Animation.filterIn)(elementName, brightnessStart, brightnessEnd, hue, 200);
    this.props.handleOverLike(this.like.style.filter);
  }

  handleMouseLeaveLike(e) {
    e.preventDefault();
    let brightnessEnd = 0.6,
        brightnessStart = 0.4,
        hue = 285,
        elementName = '#' + this.like.id;
    (0, _Animation.filterOut)(elementName, brightnessStart, brightnessEnd, hue, 200);
    this.props.handleOverLike(this.like.style.filter);
  }

  handleMouseEnterLiked(e) {
    e.preventDefault();
    let elementName = '#' + this.liked.id;
    (0, _Animation.bobble)(elementName, 500);
  }

  handleMouseLeaveLiked(e) {
    e.preventDefault();
    let elementName = '#' + this.liked.id;
    (0, _Animation.bobble)(elementName, 500);
  }

  async likeClick() {
    this.props.handleBanner(['Waiting', 'Like', this.state.memeId + '-like']);
    await this.props.interface.methods.likeMeme(this.state.userAccount, this.state.memeId).send({
      from: this.state.userAccount
    }).on('transactionHash', () => {
      this.props.handleBanner(['Writing', 'Like', this.state.memeId + '-like']);
    }).on('receipt', () => {
      this.props.handleBanner(['Success', 'Like', this.state.memeId + '-like']);
    }).then(() => {
      if (!this.state.userHasLiked) {
        this.setState({
          userHasLiked: true,
          likes: this.state.likes + 1
        });
        this.liked.style.filter = 'invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(285deg)';
        this.props.handleLike([this.state.memeId, this.state.userHasLiked, this.state.likes]);
      } else {
        this.setState({
          userHasLiked: false,
          likes: this.state.likes - 1
        });
        this.props.handleLike([this.state.memeId, this.state.userHasLiked, this.state.likes]);
      }
    }).catch(e => {
      this.props.handleBanner(['Cancel', 'Like', this.state.memeId + '-like']);
      console.error(e);
    });
  }

  async userHasLiked() {
    const userHasLiked = await this.state.memeStorage.methods.getLikers(this.state.memeId).call().then(e => e.includes(this.props.userAccount));

    if (this.state.userHasLiked !== userHasLiked) {
      this.setState({
        userHasLiked
      });
    }
  }

  render() {
    if (!this.state.isMain) {
      return this.state.userHasLiked ? /*#__PURE__*/_react.default.createElement("p", {
        className: "LikeButton-Liked",
        id: 'liked-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnterLiked,
        onMouseLeave: this.handleMouseLeaveLiked,
        ref: Ref => this.liked = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 138,
          columnNumber: 13
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "like",
        src: _heartFilled.default,
        alt: "like button",
        id: "like",
        width: "16px",
        height: "16px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 146,
          columnNumber: 15
        }
      }), /*#__PURE__*/_react.default.createElement("span", {
        className: "like",
        id: "like-count",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 147,
          columnNumber: 15
        }
      }, this.state.likes)) : /*#__PURE__*/_react.default.createElement("p", {
        className: "LikeButton",
        id: 'like-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnterLike,
        onMouseLeave: this.handleMouseLeaveLike,
        ref: Ref => this.like = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 149,
          columnNumber: 13
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "like",
        src: _heart.default,
        alt: "like button",
        id: "like",
        width: "16px",
        height: "16px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 157,
          columnNumber: 13
        }
      }), /*#__PURE__*/_react.default.createElement("span", {
        className: "like",
        id: "like-count",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 158,
          columnNumber: 13
        }
      }, this.state.likes));
    } else {
      return this.state.userHasLiked ? /*#__PURE__*/_react.default.createElement("p", {
        className: "LikeButton-Liked",
        id: 'liked-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnterLiked,
        onMouseLeave: this.handleMouseLeaveLiked,
        ref: Ref => this.liked = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 165,
          columnNumber: 13
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "like",
        src: _heartFilled.default,
        alt: "like button",
        id: "like",
        width: "21px",
        height: "21px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 173,
          columnNumber: 15
        }
      })) : /*#__PURE__*/_react.default.createElement("p", {
        className: "LikeButton",
        id: 'like-' + this.state.memeId,
        onClick: this.handleClick,
        onMouseEnter: this.handleMouseEnterLike,
        onMouseLeave: this.handleMouseLeaveLike,
        ref: Ref => this.like = Ref,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 175,
          columnNumber: 13
        }
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "like",
        src: _heart.default,
        alt: "like button",
        id: "like",
        width: "21px",
        height: "21px",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 183,
          columnNumber: 15
        }
      }));
    }
  }

}

var _default = LikeButton;
exports.default = _default;