var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pixelWindow = function (_React$Component) {
    _inherits(pixelWindow, _React$Component);

    function pixelWindow(props) {
        _classCallCheck(this, pixelWindow);

        var _this = _possibleConstructorReturn(this, (pixelWindow.__proto__ || Object.getPrototypeOf(pixelWindow)).call(this, props));

        _this.myHandleResponseFunction = function (data) {
            console.log(data);
            console.log("Response received!");
            console.log("you clicked pixelstreaming window!!");
            console.log("you will be happy!!");
            _this.setState({
                buttonname: aaaaaaa
            });
        };

        _this.state = {
            buttonname: "test"
        };
        _this.myHandleResponseFunction = _this.myHandleResponseFunction.bind(_this);
        return _this;
    }

    _createClass(pixelWindow, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            addResponseEventListener("handle_responses", this.myHandleResponseFunction);
            console.log("componentwillmount");
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { id: "player", className: "fixed-size" },
                    "False"
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "button",
                        null,
                        this.state.buttonname
                    )
                )
            );
        }
    }]);

    return pixelWindow;
}(React.Component);

var domContainer = document.querySelector('#pixelWindow');
ReactDOM.render(e(pixelWindow), domContainer);