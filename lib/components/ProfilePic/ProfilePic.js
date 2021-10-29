"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.to-string.js");

var _react = _interopRequireDefault(require("react"));

var _identicon = _interopRequireDefault(require("identicon.js"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/ProfilePic/ProfilePic.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProfilePic extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      hasPic: false
    };
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      id: "profilePic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 7
      }
    }, this.state.hasPic ? /*#__PURE__*/_react.default.createElement("img", {
      id: "profile-pic",
      alt: "profile-pic",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19,
        columnNumber: 15
      }
    }) : /*#__PURE__*/_react.default.createElement("img", {
      className: "ProfilePic",
      id: "profile-pic",
      width: "140",
      height: "140",
      alt: "profile-pic",
      src: "data:image/png;base64,".concat( //                  this.props.hasEntered
      new _identicon.default(this.props.account, 120).toString() //                    : null
      ),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23,
        columnNumber: 15
      }
    }));
  }

}

var _default = ProfilePic;
exports.default = _default;