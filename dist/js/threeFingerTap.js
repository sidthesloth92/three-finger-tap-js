"use strict";

(function (window) {
    //This is a comment;
    var threeFingerTap = {};

    threeFingerTap.nodes = [];

    threeFingerTap.init = init;

    function init(name) {
        var nodes = document.querySelectorAll(name);
        threeFingerTap.nodes = Array.from(nodes);
    }

    window.threeFingerTap = threeFingerTap;
})(window);
