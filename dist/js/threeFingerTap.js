"use strict";

(function () {

    // Private variables
    var _currentNode = void 0; // specifies the current DOM element hovered or tapped
    var _timeout = void 0; // specifies the hover timeout or tap timeout
    var _name = void 0; // specifies the CSS class name
    var _initialized = void 0; // specifies whether the library is initialized or not
    var _isMobile = void 0; // indicates a mobile device or nont

    // API variables
    var _hoverTimeout = 2000; // user specified value for the hover timeout, set to 500 if mobile
    var _customLoadingBackground = void 0; // user specified backgroundImage CSS value
    var _enable = true; // user specified value indicating whether the library is currently active

    // Private variables
    var _count = 0; // number of times the user has tapped the link within the timeout
    var _openLink = false;

    // DOM nodes
    var _body = void 0;
    var _iframeWrapper = void 0;
    var _iframe = void 0;

    // API Methods
    function init(_ref) {
        var name = _ref.name,
            hoverTimeout = _ref.hoverTimeout,
            customLoadingBackground = _ref.customLoadingBackground;

        if (!_initialized) {
            _initialized = true;
        } else {
            throw new Error("Library already initialized");
        }
        _isMobile = _isTouchDevice();
        setName(name);
        setHoverTimeout(hoverTimeout);
        setCustomLoadingBackground(customLoadingBackground);
        _constructDOM();
        _addEventListeners();
    }

    function enable() {
        _enable = true;
    }

    function disable() {
        _enable = false;
    }

    function setName(name) {
        if (!name) {
            throw new Error("Name not specified");
        }
        _name = name;
    }

    function getName() {
        return _name;
    }

    function setHoverTimeout(hoverTimeout) {
        if (!_isMobile) {
            if (isNaN(hoverTimeout)) {
                throw new Error("hoverTimeout should have a numerical value");
            }
            _hoverTimeout = hoverTimeout;
        } else {
            _hoverTimeout = 500;
            console.log("Touch device. hoverTimeout value ignored.");
        }
    }

    function getHoverTimeout() {
        return _hoverTimeout;
    }

    function setCustomLoadingBackground(customLoadingBackground) {
        var tempDiv = document.createElement('div');
        tempDiv.style.backgroundImage = customLoadingBackground;

        if (tempDiv.style.backgroundImage && !customLoadingBackground) {
            throw new Error("Invalid value for customLoadingBackground. Must be a possible value for CSS backgroundImage property");
        }
        _customLoadingBackground = customLoadingBackground;
        _updateCustomLoadingBackground();
    }

    function getCustomLoadingBackground() {
        return _customLoadingBackground;
    }

    function getIsMobileDevice() {
        return _isMobile;
    }

    // Private Methods
    function _isTouchDevice() {
        return window.hasOwnProperty('ontouchstart');
    }

    function _reset() {
        _currentNode = undefined;
        _openLink = false;
        _count = 0;
        clearTimeout(_timeout);
    }

    function _constructDOM() {
        var fragment = document.createDocumentFragment();

        _body = document.querySelector('body');
        _iframeWrapper = document.createElement('div');
        _iframeWrapper.classList.add('tft_iframe_wrapper');

        _iframe = document.createElement('iframe');
        _iframeWrapper.appendChild(_iframe);

        fragment.appendChild(_iframeWrapper);
        _body.appendChild(fragment);

        _updateCustomLoadingBackground();
    }

    function _updateCustomLoadingBackground() {
        if (_iframeWrapper) {
            if (!_customLoadingBackground) {
                _iframeWrapper.style.backgroundImage = "";

                var loader = document.createElement('div');
                loader.classList.add('loader');
                _iframeWrapper.appendChild(loader);
            } else {
                var _loader = _iframeWrapper.querySelector('.loader');
                if (_loader) {
                    _loader.remove();
                }

                _iframeWrapper.style.backgroundImage = _customLoadingBackground;
            }
        }
    }

    function _addEventListeners() {
        if (!_isMobile) {
            window.addEventListener('mousemove', function (event) {
                if (_enable && event.target.classList.contains(_name)) {
                    if (!_currentNode) {
                        _currentNode = event.target;
                        _timeout = setTimeout(function () {
                            if (_currentNode && _currentNode.classList.contains(_name)) {
                                _showPreviewWindow();
                            }
                        }, _hoverTimeout);
                    }
                } else {
                    _reset();
                }
            });
        } else {
            _openLink = false;
            window.addEventListener('click', function (event) {
                if (event.target.classList.contains(_name)) {
                    if (event.target !== _currentNode) {
                        _count = 0;
                        _currentNode = event.target;
                        clearTimeout(_timeout);
                    }
                    if (!_openLink) {
                        _count++;

                        if (_count == 1) {
                            _timeout = setTimeout(function () {
                                if (_currentNode) {
                                    if (_count >= 3 && _enable) {
                                        _showPreviewWindow();
                                        _reset();
                                    } else {
                                        _openLink = true;
                                        _currentNode.click();
                                    }
                                }
                            }, _hoverTimeout);
                        }
                        event.preventDefault();
                    } else {
                        _reset();
                    }
                } else {
                    _reset();
                }
            });
        }
        _body.addEventListener('click', _hidePreviewWindow);
    }

    function _showPreviewWindow() {
        var positionBox = _currentNode.getBoundingClientRect();

        var _findQuadrant2 = _findQuadrant(positionBox),
            xQuadrant = _findQuadrant2.xQuadrant,
            yQuadrant = _findQuadrant2.yQuadrant;

        var previewWindowData = _findPreviewWindowPosition({ xQuadrant: xQuadrant, yQuadrant: yQuadrant, positionBox: positionBox });
        previewWindowData.src = _currentNode.getAttribute('href');
        _updatePreviewWindow(previewWindowData);
    }

    function _hidePreviewWindow(event) {
        _iframeWrapper.classList.remove('show');
        _iframeWrapper.style.left = "";
        _iframeWrapper.style.top = "";
        _iframe.setAttribute('src', '');
        _body.classList.remove('noscroll');
    }

    function _findQuadrant(positionBox) {
        var x = positionBox.left,
            y = positionBox.top;

        console.log(x, y);

        // var xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        // var yQuadrant = (y < (window.innerHeight / 3)) ? 0 : (y < (window.innerHeight / 3 * 2)) ? 1 : 2;
        var xPointOne = window.innerWidth / 2 - 0.1 * window.innerWidth;
        var xPointTwo = window.innerWidth / 2 + 0.1 * window.innerWidth;
        var xQuadrant = x < xPointOne ? 0 : x < xPointTwo ? 1 : 2;
        var yQuadrant = y < window.innerHeight / 2 ? 0 : 1;
        console.log("xQuadrant: " + xQuadrant + ", yQuadrant : " + yQuadrant);

        return {
            xQuadrant: xQuadrant,
            yQuadrant: yQuadrant
        };
    }

    function _findPreviewWindowPosition(_ref2) {
        var xQuadrant = _ref2.xQuadrant,
            yQuadrant = _ref2.yQuadrant,
            positionBox = _ref2.positionBox;


        var top = void 0,
            bottom = void 0,
            left = void 0,
            right = void 0;

        if (xQuadrant === 0) {
            left = positionBox.left + 'px';
            right = "";
        } else if (xQuadrant === 1) {
            left = positionBox.left - window.innerWidth * 0.7 / 2 + positionBox.width / 2 + 'px';
            right = "";
        } else if (xQuadrant === 2) {
            left = "";
            right = window.innerWidth - positionBox.right + 'px';
        }

        if (!yQuadrant) {
            top = positionBox.top + positionBox.height + 10 + 'px';
            bottom = "";
        } else {
            top = "";
            bottom = window.innerHeight - positionBox.top + 10 + 'px';
        }
        // var left = (0.3 * window.innerWidth) - (((0.3 * window.innerWidth) / 2) * xQuadrant);
        // var top = (0.3 * window.innerHeight) - (((0.3 * window.innerHeight) / 2) * yQuadrant);

        console.log("top: " + top + " bottom : " + bottom);
        console.log("left : " + left + " right : " + right);

        return {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        };
    }

    function _updatePreviewWindow(_ref3) {
        var top = _ref3.top,
            bottom = _ref3.bottom,
            left = _ref3.left,
            right = _ref3.right,
            src = _ref3.src;

        _body.classList.add('noscroll');
        _iframeWrapper.classList.add('show');

        _iframeWrapper.style.top = top;
        _iframeWrapper.style.bottom = bottom;

        _iframeWrapper.style.left = left;
        _iframeWrapper.style.right = right;

        _iframe.setAttribute('src', src);
    }

    var threeFingerTap = {
        init: init,
        enable: enable,
        disable: disable,
        setName: setName,
        getName: getName,
        getHoverTimeout: getHoverTimeout,
        setHoverTimeout: setHoverTimeout,
        getCustomLoadingBackground: getCustomLoadingBackground,
        setCustomLoadingBackground: setCustomLoadingBackground,
        getIsMobileDevice: getIsMobileDevice
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = threeFingerTap;
    } else {
        window.threeFingerTap = threeFingerTap;
    }
})();
