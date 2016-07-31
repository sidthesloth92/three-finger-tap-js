((window) => {

    // Private variables
    let _currentNode;
    let _timeout;
    let _name;
    let _initialized;
    let _isMobile;

    // API variables
    let _hoverTimeout = 2000;
    let _customLoadingBackground;
    let _enable = true;

    // API Methods
    function init({ name, hoverTimeout, customLoadingBackground}) {
        if(!_initialized) {
            _initialized = true;
        }
        else {
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
        if(!_isMobile) {
            if (isNaN(hoverTimeout)) {
                throw new Error("hoverTimeout should have a numerical value");
            }
            _hoverTimeout = hoverTimeout;
        }
        else {
            _hoverTimeout = 500;
            console.log("Touch device. hoverTimeout value ignored.");
        }
    }

    function getHoverTimeout() {
        return _hoverTimeout;
    }

    function setCustomLoadingBackground(customLoadingBackground) {
        let tempDiv = document.createElement('div');
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
        let iframeWrapper = document.querySelector('.tft_iframe_wrapper');

        if (iframeWrapper) {
            if (!_customLoadingBackground) {
                iframeWrapper.style.backgroundImage = "";

                let loader = document.createElement('div');
                loader.classList.add('loader');
                iframeWrapper.appendChild(loader);
            }
            else {
                let loader = iframeWrapper.querySelector('.loader');
                if(loader) {
                    loader.remove();
                }

                iframeWrapper.style.backgroundImage = _customLoadingBackground;
            }
        }
    }
    let _count = 0;
    function _addEventListeners() {
         function _reset() {
            _openLink = false;
            _count = 0;
            _currentNode = undefined;
            clearTimeout(_timeout);
        }

        if(!_isMobile) {
            window.addEventListener('mousemove', (event) => {
                if (event.target.classList.contains(_name)) {
                    if (!_currentNode && _enable) {
                        _currentNode = event.target;
                        _timeout = setTimeout(() => {
                            if (_currentNode && _currentNode.classList.contains(_name)) {
                                _showPreviewWindow();
                            }
                        }, _hoverTimeout);
                    }
                }
                else {
                    _currentNode = undefined;
                    clearTimeout(_timeout);
                }
            });
        }
        else {
            let _openLink = false;
            window.addEventListener('click', (event) => {
                if (event.target.classList.contains(_name)) {
                    if(event.target !== _currentNode) {
                        _count = 0;
                        _currentNode = event.target;
                        clearTimeout(_timeout);
                    }
                    if(!_openLink) {
                         _count++;

                        if(_count == 1) {
                            _timeout = setTimeout(() => {
                                if(_currentNode) {
                                    if(_count >= 3 && _enable) {
                                        _showPreviewWindow();
                                        _reset();
                                    }
                                    else {
                                        _openLink = true;
                                        _currentNode.click();
                                    }
                                }
                            }, _hoverTimeout);
                        }
                        event.preventDefault();
                    }
                    else {
                        _reset.call(this);
                    }
                }
                else {
                    _reset.call(this);
                }
            });

           
        }
        
        let body = document.querySelector('body');
        body.addEventListener('click', _hidePreviewWindow);
    }



    function _showPreviewWindow() {
        let positionBox = _currentNode.getBoundingClientRect();
        let { xQuadrant, yQuadrant } = _findQuadrant(positionBox);

        let previewWindowData = _findPreviewWindowPosition({ xQuadrant, yQuadrant, positionBox });
        previewWindowData.src = _currentNode.getAttribute('href');
        _updatePreviewWindow(previewWindowData);
    }

    function _hidePreviewWindow(event) {
        let body = document.querySelector('body');
        let iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        let iframe = iframe_wrapper.querySelector('iframe');

        iframe_wrapper.classList.remove('show');
        iframe_wrapper.style.left = "";
        iframe_wrapper.style.top = "";
        iframe.setAttribute('src', '');
        body.classList.remove('noscroll');
    }

    function _findQuadrant(positionBox) {
        let { left: x, top: y } = positionBox;
        console.log(x, y);

        // var xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        // var yQuadrant = (y < (window.innerHeight / 3)) ? 0 : (y < (window.innerHeight / 3 * 2)) ? 1 : 2;
        let xPointOne = (window.innerWidth / 2) - (0.1 * window.innerWidth);
        let xPointTwo = (window.innerWidth / 2) + (0.1 * window.innerWidth);
        let xQuadrant = (x < xPointOne) ? 0 : (x < xPointTwo) ? 1 : 2;
        let yQuadrant = (y < (window.innerHeight / 2)) ? 0 : 1;
        console.log(`xQuadrant: ${xQuadrant}, yQuadrant : ${yQuadrant}`);

        return {
            xQuadrant,
            yQuadrant
        };
    }

    function _findPreviewWindowPosition({ xQuadrant, yQuadrant, positionBox }) {

        let top, bottom, left, right;

        if (xQuadrant === 0) {
            left = positionBox.left + 'px';
            right = "";
        }
        else if (xQuadrant === 1) {
            left = (positionBox.left - ((window.innerWidth * 0.7) / 2) + (positionBox.width / 2)) + 'px';
            right = "";
        }
        else if (xQuadrant === 2) {
            left = "";
            right = (window.innerWidth - positionBox.right) + 'px';
        }

        if (!yQuadrant) {
            top = positionBox.top + positionBox.height + 10 + 'px';
            bottom = "";
        }
        else {
            top = "";
            bottom = (window.innerHeight - positionBox.top + 10) + 'px';
        }
        // var left = (0.3 * window.innerWidth) - (((0.3 * window.innerWidth) / 2) * xQuadrant);
        // var top = (0.3 * window.innerHeight) - (((0.3 * window.innerHeight) / 2) * yQuadrant);

        console.log(`top: ${top} bottom : ${bottom}`);
        console.log(`left : ${left} right : ${right}`);

        return {
            top,
            right,
            bottom,
            left
        };
    }

    function _updatePreviewWindow({ top, bottom, left, right, src }) {
        let body = document.querySelector('body');
        let iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        let iframe = iframe_wrapper.querySelector('iframe');

        body.classList.add('noscroll');
        iframe_wrapper.classList.add('show');

        iframe_wrapper.style.top = top;
        iframe_wrapper.style.bottom = bottom;

        iframe_wrapper.style.left = left;
        iframe_wrapper.style.right = right;

        iframe.setAttribute('src', src);
    }

    var threeFingerTap = {
        init,
        enable,
        disable,
        setName,
        getName,
        getHoverTimeout,
        setHoverTimeout,
        getCustomLoadingBackground,
        setCustomLoadingBackground,
        getIsMobileDevice
    };
    window.threeFingerTap = threeFingerTap;
})(window);