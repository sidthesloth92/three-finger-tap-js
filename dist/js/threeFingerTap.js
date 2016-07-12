'use strict';

(function (window) {

    var threeFingerTap = {};
    var timeout = void 0;

    threeFingerTap.currentNode = undefined;
    threeFingerTap.nodes = [];

    threeFingerTap.addMouseMoveListener = addMouseMoveListener;
    threeFingerTap.init = init;
    threeFingerTap.constructIframe = constructIframe;
    threeFingerTap.showPreviewWindow = showPreviewWindow;
    // threeFingerTap.resize = resize;
    threeFingerTap.findQuadrant = findQuadrant;

    function addMouseMoveListener() {
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
    }
    function init(name) {
        threeFingerTap.name = name;
        threeFingerTap.addMouseMoveListener();
        threeFingerTap.constructIframe();
        // let nodes = document.querySelectorAll(name);
        // threeFingerTap.nodes = Array.from(nodes);
    }

    function constructIframe() {
        var iframeWrapper = document.createElement('div');
        iframeWrapper.classList.add('tft_iframe_wrapper');

        var iframe = document.createElement('iframe');
        iframeWrapper.appendChild(iframe);

        document.querySelector('body').appendChild(iframeWrapper);
    }

    function showPreviewWindow() {
        console.log("showPreviewWindow");
        threeFingerTap.findQuadrant(threeFingerTap.currentNode);
    }

    // function resize() {
    //     let { innerHeight : height, innerWidth : width } = window;
    //     threeFingerTap.height = height;
    //     threeFingerTap.width = width;
    // }

    function findQuadrant(element) {
        var positionBox = element.getBoundingClientRect();
        console.dir(positionBox);
        var x = positionBox.left;
        var y = positionBox.top;

        console.log(x, y);

        // var xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        // var yQuadrant = (y < (window.innerHeight / 3)) ? 0 : (y < (window.innerHeight / 3 * 2)) ? 1 : 2;

        var xQuadrant = x < window.innerWidth / 3 ? 0 : x < window.innerWidth / 3 * 2 ? 1 : 2;
        var yQuadrant = y < window.innerHeight / 2 ? 0 : 1;
        console.log(xQuadrant, yQuadrant);

        var top, bottom, left, right;

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
        console.log("left " + left + " right : " + right);
        if (!yQuadrant) {
            console.log("The element is the top quadrant");
            top = positionBox.top + positionBox.height + 10 + 'px';
            bottom = "";
        } else {
            console.log("The element is the bottom quadrant");
            top = "";
            bottom = window.innerHeight - positionBox.top + 10 + 'px';
        }
        // var left = (0.3 * window.innerWidth) - (((0.3 * window.innerWidth) / 2) * xQuadrant);
        // var top = (0.3 * window.innerHeight) - (((0.3 * window.innerHeight) / 2) * yQuadrant);

        // console.log(`left: ${left} top: ${top}`);

        var iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        iframe_wrapper.classList.add('show');

        console.log(top, bottom);
        iframe_wrapper.style.top = top;
        iframe_wrapper.style.bottom = bottom;

        console.log("left " + left + " right : " + right);
        iframe_wrapper.style.left = left;
        iframe_wrapper.style.right = right;
    }
    window.threeFingerTap = threeFingerTap;
})(window);
