((window) => {
    
    let threeFingerTap  = {};
    let timeout;
    
    threeFingerTap.currentNode = undefined;
    threeFingerTap.nodes = [];

    threeFingerTap.addEventListeners = addEventListeners;
    threeFingerTap.init = init;
    threeFingerTap.constructDOM = constructDOM;
    threeFingerTap.showPreviewWindow = showPreviewWindow;
    threeFingerTap.findQuadrant = findQuadrant;
    threeFingerTap.findPreviewWindowPosition = findPreviewWindowPosition;
    threeFingerTap.updatePreviewWindow = updatePreviewWindow;
    // threeFingerTap.resize = resize;
    
    
    function addEventListeners() {
       window.addEventListener('mousemove', (event) => {
            if(event.target.classList.contains(threeFingerTap.name)) {
                console.log("in here");
                if(!threeFingerTap.currentNode) {
                    threeFingerTap.currentNode = event.target;

                    timeout = setTimeout(() => {
                        if(threeFingerTap.currentNode && threeFingerTap.currentNode.classList.contains(threeFingerTap.name)) {
                            threeFingerTap.showPreviewWindow();
                        }
                    }, 2000);
                }
            }
            else {
                threeFingerTap.currentNode = undefined;
                clearTimeout(timeout);
            }
        });

        let iframe_overlay = document.querySelector('.tft_iframe_overlay');
        iframe_overlay.addEventListener('click', (event) => {
            
        });
    }
    function init(name) {
        threeFingerTap.name = name;
        threeFingerTap.constructDOM();
        threeFingerTap.addEventListeners();
        // let nodes = document.querySelectorAll(name);
        // threeFingerTap.nodes = Array.from(nodes);
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
        let positionBox = threeFingerTap.currentNode.getBoundingClientRect();
        let { xQuadrant, yQuadrant } = threeFingerTap.findQuadrant(positionBox);
        
        let positions = threeFingerTap.findPreviewWindowPosition({ xQuadrant, yQuadrant, positionBox });
        threeFingerTap.updatePreviewWindow(positions);
    }

    // function resize() {
    //     let { innerHeight : height, innerWidth : width } = window;
    //     threeFingerTap.height = height;
    //     threeFingerTap.width = width;
    // }

    function findQuadrant(positionBox) {
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

    function findPreviewWindowPosition({ xQuadrant, yQuadrant, positionBox }) {

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
        
        // console.log(`left: ${left} top: ${top}`);
        console.log(`top: ${top} bottom : ${bottom}`);
        console.log(`left : ${left} right : ${right}`);
        
        return  {
            top,
            right,
            bottom,
            left
        };
    }

    function updatePreviewWindow({ top, bottom, left, right }) {
        let iframe_wrapper = document.querySelector('.tft_iframe_wrapper');
        let iframe_overlay = document.querySelector('.tft_iframe_overlay');

        iframe_wrapper.classList.add('show');
        iframe_overlay.classList.add('show');

        iframe_wrapper.style.top = top;
        iframe_wrapper.style.bottom = bottom;

        iframe_wrapper.style.left = left;
        iframe_wrapper.style.right = right;
    }

    window.threeFingerTap = threeFingerTap;
})(window);