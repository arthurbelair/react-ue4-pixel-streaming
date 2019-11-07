"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

require("./index.css");

var _App = _interopRequireDefault(require("./App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import App from './App';
// import * as serviceWorker from './serviceWorker';
_reactDom.default.render(_react.default.createElement(_App.default, null), document.getElementById('root'));