"use strict";

(function (window) {

    // Private variables
    var _currentNode = void 0;
    var _timeout = void 0;
    var _name = void 0;

    // API variables
    var _hoverTimeout = 2000;
    var _customLoadingBackground = void 0;

    // API Methods
    function init(_ref) {
        var name = _ref.name;
        var hoverTimeout = _ref.hoverTimeout;
        var customLoadingBackground = _ref.customLoadingBackground;

        setName(name);
        setHoverTimeout(hoverTimeout);
        setCustomLoadingBackground(customLoadingBackground);
        _constructDOM();
        _addEventListeners();
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
        if (isNaN(hoverTimeout)) {
            throw new Error("hoverTimeout should have a numerical value");
        }
        _hoverTimeout = hoverTimeout;
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

    // Private Methods
    function _constructDOM() {

        var fragment = document.createDocumentFragment();

        var iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add('tft_iframe_wrapper');

        var iframe = document.createElement('iframe');
        iframeWrapper.appendChild(iframe);

        fragment.appendChild(iframeWrapper);
        document.querySelector('body').appendChild(fragment);

        _updateCustomLoadingBackground();
    }

    function _updateCustomLoadingBackground() {
        var iframeWrapper = document.querySelector('.tft_iframe_wrapper');

        if (iframeWrapper) {
            if (!_customLoadingBackground) {
                iframeWrapper.style.backgroundImage = "";

                var loader = document.createElement('div');
                loader.classList.add('loader');
                iframeWrapper.appendChild(loader);
            } else {
                var _loader = iframeWrapper.querySelector('.loader');
                if (_loader) {
                    _loader.remove();
                }

                iframeWrapper.style.backgroundImage = _customLoadingBackground;
            }
        }
    }

    function _addEventListeners() {
        window.addEventListener('mousemove', function (event) {
            if (event.target.classList.contains(_name)) {
                if (!_currentNode) {
                    _currentNode = event.target;
                    _timeout = setTimeout(function () {
                        if (_currentNode && _currentNode.classList.contains(_name)) {
                            _showPreviewWindow();
                        }
                    }, _hoverTimeout);
                }
            } else {
                _currentNode = undefined;
                clearTimeout(_timeout);
            }
        });

        var body = document.querySelector('body');
        body.addEventListener('click', _hidePreviewWindow);
    }

    function _showPreviewWindow() {
        var positionBox = _currentNode.getBoundingClientRect();

        var _findQuadrant2 = _findQuadrant(positionBox);

        var xQuadrant = _findQuadrant2.xQuadrant;
        var yQuadrant = _findQuadrant2.yQuadrant;


        var previewWindowData = _findPreviewWindowPosition({ xQuadrant: xQuadrant, yQuadrant: yQuadrant, positionBox: positionBox });
        previewWindowData.src = _currentNode.getAttribute('href');
        _updatePreviewWindow(previewWindowData);
    }

    function _hidePreviewWindow(event) {
        var body = document.querySelector('body');
        var iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        var iframe = iframe_wrapper.querySelector('iframe');

        iframe_wrapper.classList.remove('show');
        iframe_wrapper.style.left = "";
        iframe_wrapper.style.top = "";
        iframe.setAttribute('src', '');
        body.classList.remove('noscroll');
    }

    function _findQuadrant(positionBox) {
        var x = positionBox.left;
        var y = positionBox.top;

        console.log(x, y);

        // var xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        // var yQuadrant = (y < (window.innerHeight / 3)) ? 0 : (y < (window.innerHeight / 3 * 2)) ? 1 : 2;

        var xQuadrant = x < window.innerWidth / 3 ? 0 : x < window.innerWidth / 3 * 2 ? 1 : 2;
        var yQuadrant = y < window.innerHeight / 2 ? 0 : 1;
        console.log("xQuadrant: " + xQuadrant + ", yQuadrant : " + yQuadrant);

        return {
            xQuadrant: xQuadrant,
            yQuadrant: yQuadrant
        };
    }

    function _findPreviewWindowPosition(_ref2) {
        var xQuadrant = _ref2.xQuadrant;
        var yQuadrant = _ref2.yQuadrant;
        var positionBox = _ref2.positionBox;


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
        var top = _ref3.top;
        var bottom = _ref3.bottom;
        var left = _ref3.left;
        var right = _ref3.right;
        var src = _ref3.src;

        var body = document.querySelector('body');
        var iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        var iframe = iframe_wrapper.querySelector('iframe');

        body.classList.add('noscroll');
        iframe_wrapper.classList.add('show');

        iframe_wrapper.style.top = top;
        iframe_wrapper.style.bottom = bottom;

        iframe_wrapper.style.left = left;
        iframe_wrapper.style.right = right;

        iframe.setAttribute('src', src);
    }

    var threeFingerTap = {
        init: init,
        setName: setName,
        getName: getName,
        getHoverTimeout: getHoverTimeout,
        setHoverTimeout: setHoverTimeout,
        getCustomLoadingBackground: getCustomLoadingBackground,
        setCustomLoadingBackground: setCustomLoadingBackground
    };
    window.threeFingerTap = threeFingerTap;
})(window);
