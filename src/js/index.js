((window) => {
    
    // Private variables
    let _currentNode;
    let _timeout;
    let _name;

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
       window.addEventListener('mousemove', (event) => {
            if(event.target.classList.contains(_name)) {
                if(!_currentNode) {
                    _currentNode = event.target;

                    _timeout = setTimeout(() => {
                        if(_currentNode && _currentNode.classList.contains(_name)) {
                            _showPreviewWindow();
                        }
                    }, threeFingerTap.hoverTimeout);
                }
            }
            else {
                _currentNode = undefined;
                clearTimeout(_timeout);
            }
        });

        let iframe_overlay = document.querySelector('body');
        iframe_overlay.addEventListener('click', _hidePreviewWindow);
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
        let iframe_overlay = document.querySelector('.tft_iframe_overlay');
        let iframe = iframe_wrapper.querySelector('iframe');

        iframe_wrapper.classList.remove('show');
        iframe_overlay.classList.remove('show');
        body.classList.remove('noscroll');
        iframe.setAttribute('src', '');
    }

    function _findQuadrant(positionBox) {
        let { left : x, top : y } = positionBox;
        console.log(x, y);

        // var xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        // var yQuadrant = (y < (window.innerHeight / 3)) ? 0 : (y < (window.innerHeight / 3 * 2)) ? 1 : 2;

        let xQuadrant = (x < (window.innerWidth / 3)) ? 0 : (x < (window.innerWidth / 3 * 2)) ? 1 : 2;
        let yQuadrant = (y < (window.innerHeight / 2)) ? 0 : 1;
        console.log(`xQuadrant: ${xQuadrant}, yQuadrant : ${yQuadrant}`);

        return {
            xQuadrant,
            yQuadrant
        };
    }

    function _findPreviewWindowPosition({ xQuadrant, yQuadrant, positionBox }) {

        let top, bottom, left, right;

        if(xQuadrant === 0) {
            left = positionBox.left + 'px';
            right = "";
        }
        else if(xQuadrant === 1) {
            left = (positionBox.left - ((window.innerWidth * 0.7) / 2) + (positionBox.width / 2)) + 'px';
            right = "";
        }
        else if(xQuadrant === 2) {
            left = "";
            right = (window.innerWidth - positionBox.right) + 'px';
        }
        
        if(!yQuadrant) {
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
        
        return  {
            top,
            right,
            bottom,
            left
        };
    }

    function _updatePreviewWindow({ top, bottom, left, right , src }) {
        let body = document.querySelector('body');
        let iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        let iframe_overlay = document.querySelector('.tft_iframe_overlay');
        let iframe = iframe_wrapper.querySelector('iframe');

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
        init,
        hoverTimeout : 2000
    };
    window.threeFingerTap = threeFingerTap;
})(window);