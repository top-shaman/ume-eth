"use strict";

var _react = require("@testing-library/react");

var _App = _interopRequireDefault(require("./App"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/App/App.test.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('renders learn react link', () => {
  (0, _react.render)( /*#__PURE__*/React.createElement(_App.default, {
    __self: void 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5,
      columnNumber: 10
    }
  }));

  const linkElement = _react.screen.getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});