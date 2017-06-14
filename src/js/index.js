(() => {

    // Private variables
    let _currentNode;                   // specifies the current DOM element hovered or tapped
    let _timeout;                       // specifies the hover timeout or tap timeout
    let _name;                          // specifies the CSS class name
    let _initialized;                   // specifies whether the library is initialized or not
    let _isMobile;                      // indicates a mobile device or nont

    // API variables
    let _hoverTimeout;           // user specified value for the hover timeout, set to 500 if mobile
    let _customLoadingBackground;       // user specified backgroundImage CSS value
    let _enable = true;                 // user specified value indicating whether the library is currently active
    
    // Private variables
    let _count = 0;                     // number of times the user has tapped the link within the timeout
    let _openLink = false;      

    // DOM nodes
    let _body;
    let _iframeWrapper;
    let _iframe;

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
        _enable = true;
    }

    function destroy() {
        _body.removeChild(_iframeWrapper);

        window.removeEventListener('mousemove', _browserFunctionality);
        window.removeEventListener('click', _mobileFunctionality);

        _body.removeEventListener('click', _hidePreviewWindow);

        _body = _iframeWrapper = _iframe = _name = _isMobile = _customLoadingBackground = _hoverTimeout = undefined;
        _reset();

        _initialized = false;
        _enable = false;
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

    function _reset() {
        _currentNode = undefined;
        _openLink = false;
        _count = 0;
        clearTimeout(_timeout);
    }

    function _constructDOM() {
        let fragment = document.createDocumentFragment();

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

                let loader = document.createElement('div');
                loader.classList.add('loader');
                _iframeWrapper.appendChild(loader);
            }
            else {
                let loader = _iframeWrapper.querySelector('.loader');
                if(loader) {
                    loader.remove();
                }

                _iframeWrapper.style.backgroundImage = _customLoadingBackground;
            }
        }
    }
    
    function _addEventListeners() {
        if (!_isMobile) {
            window.addEventListener('mousemove', _browserFunctionality);
        } else {
            _openLink = false;
            window.addEventListener('click', _mobileFunctionality);
        }
        _body.addEventListener('click', _hidePreviewWindow);
    }
    function _browserFunctionality(event) {
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
    }
    function _mobileFunctionality(event) {
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
    }

    function _showPreviewWindow() {
        let positionBox = _currentNode.getBoundingClientRect();
        let { xQuadrant, yQuadrant } = _findQuadrant(positionBox);

        let previewWindowData = _findPreviewWindowPosition({ xQuadrant, yQuadrant, positionBox });
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
        _body.classList.add('noscroll');
        _iframeWrapper.classList.add('show');

        _iframeWrapper.style.top = top;
        _iframeWrapper.style.bottom = bottom;

        _iframeWrapper.style.left = left;
        _iframeWrapper.style.right = right;

        _iframe.setAttribute('src', src);
    }

    let threeFingerTap =  {
        init,
        destroy,
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

    if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = threeFingerTap;
    }
    else {
        window.threeFingerTap = threeFingerTap;
    }
})();


