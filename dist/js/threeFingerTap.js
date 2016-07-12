'use strict';

(function (window) {

    var threeFingerTap = {};
    var timeout = void 0;

    threeFingerTap.currentNode = undefined;

    threeFingerTap.addEventListeners = addEventListeners;
    threeFingerTap.init = init;
    threeFingerTap.constructDOM = constructDOM;
    threeFingerTap.showPreviewWindow = showPreviewWindow;
    threeFingerTap.findQuadrant = findQuadrant;
    threeFingerTap.findPreviewWindowPosition = findPreviewWindowPosition;
    threeFingerTap.updatePreviewWindow = updatePreviewWindow;
    // threeFingerTap.resize = resize;

    function addEventListeners() {
        window.addEventListener('mousemove', function (event) {
            if (event.target.classList.contains(threeFingerTap.name)) {
                console.log("in here");
                if (!threeFingerTap.currentNode) {
                    threeFingerTap.currentNode = event.target;

                    timeout = setTimeout(function () {
                        if (threeFingerTap.currentNode && threeFingerTap.currentNode.classList.contains(threeFingerTap.name)) {
                            threeFingerTap.showPreviewWindow();
                        }
                    }, 2000);
                }
            } else {
                threeFingerTap.currentNode = undefined;
                clearTimeout(timeout);
            }
        });

        var iframe_overlay = document.querySelector('.tft_iframe_overlay');
        iframe_overlay.addEventListener('click', function (event) {});
    }
    function init(name) {
        threeFingerTap.name = name;
        threeFingerTap.constructDOM();
        threeFingerTap.addEventListeners();
    }

    function constructDOM() {

        var fragment = document.createDocumentFragment();

        var iframeOverlay = document.createElement('div');
        iframeOverlay.classList.add('tft_iframe_overlay');
        fragment.appendChild(iframeOverlay);

        var iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add('tft_iframe_wrapper');

        var iframe = document.createElement('iframe');
        iframeWrapper.appendChild(iframe);

        fragment.appendChild(iframeWrapper);
        document.querySelector('body').appendChild(fragment);
    }

    function showPreviewWindow() {
        console.log("showPreviewWindow");
        var positionBox = threeFingerTap.currentNode.getBoundingClientRect();

        var _threeFingerTap$findQ = threeFingerTap.findQuadrant(positionBox);

        var xQuadrant = _threeFingerTap$findQ.xQuadrant;
        var yQuadrant = _threeFingerTap$findQ.yQuadrant;


        var positions = threeFingerTap.findPreviewWindowPosition({ xQuadrant: xQuadrant, yQuadrant: yQuadrant, positionBox: positionBox });
        threeFingerTap.updatePreviewWindow(positions);
    }

    // function resize() {
    //     let { innerHeight : height, innerWidth : width } = window;
    //     threeFingerTap.height = height;
    //     threeFingerTap.width = width;
    // }

    function findQuadrant(positionBox) {
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

    function findPreviewWindowPosition(_ref) {
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

    function updatePreviewWindow(_ref2) {
        var top = _ref2.top;
        var bottom = _ref2.bottom;
        var left = _ref2.left;
        var right = _ref2.right;

        var iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        var iframe_overlay = document.querySelector('.tft_iframe_overlay');

        iframe_wrapper.classList.add('show');
        iframe_overlay.classList.add('show');

        iframe_wrapper.style.top = top;
        iframe_wrapper.style.bottom = bottom;

        iframe_wrapper.style.left = left;
        iframe_wrapper.style.right = right;
    }

    window.threeFingerTap = threeFingerTap;
})(window);
