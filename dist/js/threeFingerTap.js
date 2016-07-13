'use strict';

(function (window) {

    // Private variables
    var _currentNode = void 0;
    var _timeout = void 0;
    var _name = void 0;

    // API Methods
    function init(name) {
        _name = name;
        _constructDOM();
        _addEventListeners();
    }

    // Private Methods
    function _constructDOM() {

        var fragment = document.createDocumentFragment();

        var iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add('tft_iframe_wrapper');

        var iframe = document.createElement('iframe');
        iframeWrapper.appendChild(iframe);

        var loader = document.createElement('div');
        loader.classList.add('loader');
        iframeWrapper.appendChild(loader);

        fragment.appendChild(iframeWrapper);
        document.querySelector('body').appendChild(fragment);
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
                    }, threeFingerTap.hoverTimeout);
                }
            } else {
                _currentNode = undefined;
                clearTimeout(_timeout);
            }
        });

        var iframe_overlay = document.querySelector('body');
        iframe_overlay.addEventListener('click', _hidePreviewWindow);
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
        var iframe_overlay = document.querySelector('.tft_iframe_overlay');
        var iframe = iframe_wrapper.querySelector('iframe');

        iframe_wrapper.classList.remove('show');
        iframe_overlay.classList.remove('show');
        body.classList.remove('noscroll');
        iframe.setAttribute('src', '');
    }

    function _findQuadrant(positionBox) {
        var x = positionBox.left;
        var y = positionBox.top;

        console.log(x, y);

        // var xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        // var yQuadrant = (y < (window.innerHeight / 3)) ? 0 : (y < (window.innerHeight / 3 * 2)) ? 1 : 2;

        var xQuadrant = x < window.innerWidth / 3 ? 0 : x < window.innerWidth / 3 * 2 ? 1 : 2;
        var yQuadrant = y < window.innerHeight / 2 ? 0 : 1;
        console.log('xQuadrant: ' + xQuadrant + ', yQuadrant : ' + yQuadrant);

        return {
            xQuadrant: xQuadrant,
            yQuadrant: yQuadrant
        };
    }

    function _findPreviewWindowPosition(_ref) {
        var xQuadrant = _ref.xQuadrant;
        var yQuadrant = _ref.yQuadrant;
        var positionBox = _ref.positionBox;


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

        console.log('top: ' + top + ' bottom : ' + bottom);
        console.log('left : ' + left + ' right : ' + right);

        return {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        };
    }

    function _updatePreviewWindow(_ref2) {
        var top = _ref2.top;
        var bottom = _ref2.bottom;
        var left = _ref2.left;
        var right = _ref2.right;
        var src = _ref2.src;

        var body = document.querySelector('body');
        var iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        var iframe_overlay = document.querySelector('.tft_iframe_overlay');
        var iframe = iframe_wrapper.querySelector('iframe');

        body.classList.add('noscroll');
        iframe_wrapper.classList.add('show');
        iframe_overlay.classList.add('show');

        iframe_wrapper.style.top = top;
        iframe_wrapper.style.bottom = bottom;

        iframe_wrapper.style.left = left;
        iframe_wrapper.style.right = right;

        iframe.setAttribute('src', src);
    }

    var threeFingerTap = {
        init: init,
        hoverTimeout: 2000
    };
    window.threeFingerTap = threeFingerTap;
})(window);
