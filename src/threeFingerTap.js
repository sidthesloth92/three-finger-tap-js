((window) => {
    var threeFingerTap  = {};

    threeFingerTap.nodes = [];


    threeFingerTap.init = init;

    function init() {
        var nodes = document.querySelectorAll('.three-finger-tap');
        threeFingerTap.nodes = Array.from(nodes);
    }

    window.threeFingerTap = threeFingerTap;
})(window);