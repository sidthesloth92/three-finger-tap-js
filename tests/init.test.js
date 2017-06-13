const threeFingerTap = require('../dist/js/threeFingerTap.js');


describe("test initialization", () => {
    
    test("test for name" , () => {
        threeFingerTap.init({
            name : 'three-finger-tap',
            hoverTimeout : 1000
        });
        expect(threeFingerTap.getName()).toBe('three-finger-tap');
    });

});