'use strict';

const threeFingerTap = require('../dist/js/threeFingerTap.js');

let name = 'three-finger-tap';
let hoverTimeout = 1000;

describe("test initialization", () => {
    
    test("test name initialization and hover default" , () => {
        threeFingerTap.init({
            name : name,
            hoverTimeout : hoverTimeout
        });

        expect(document.body.getElementsByClassName('tft_iframe_wrapper')).toHaveLength(1);
        expect(threeFingerTap.getName()).toBe(name);
        expect(threeFingerTap.getHoverTimeout()).toEqual(hoverTimeout);
    });

    test("test custom hoverTimeout initialization" , () => {
        threeFingerTap.init({
            name : name,
            hoverTimeout : 2000
        });

        expect(document.body.getElementsByClassName('tft_iframe_wrapper')).toHaveLength(1);
        expect(threeFingerTap.getHoverTimeout()).toEqual(2000);
    });

    test("test default customLoadingBackground" , () => {
        threeFingerTap.init({
            name : name,
            hoverTimeout : hoverTimeout
        });
        
        expect(document.body.getElementsByClassName('tft_iframe_wrapper')).toHaveLength(1);
        expect(document.body.querySelector('.tft_iframe_wrapper').querySelector('.loader')).toBeDefined();
    });
    
    afterEach(() =>  {
        threeFingerTap.destroy();
    });

});