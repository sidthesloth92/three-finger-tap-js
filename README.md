![Library Logo](https://raw.githubusercontent.com/sidthesloth92/three-finger-tap-js/master/logo/logo.png)

![Library Logo](https://raw.githubusercontent.com/sidthesloth92/three-finger-tap-js/master/logo/text.png)

Logo : [@tangentkitty](https://github.com/tangentkitty)

[![release](https://img.shields.io/github/release/sidthesloth92/three-finger-tap-js.svg)](https://github.com/sidthesloth92/three-finger-tap-js/releases/tag/v1.0.1)
[![build](https://img.shields.io/travis/sidthesloth92/three-finger-tap-js.svg)](https://travis-ci.org/sidthesloth92/three-finger-tap-js/builds)
[![dependencies](https://david-dm.org/sidthesloth92/three-finger-tap-js.svg)](https://david-dm.org/sidthesloth92/three-finger-tap-js)
[![dependencies](https://img.shields.io/npm/dt/three-finger-tap-js.svg)](https://img.shields.io/npm/dt/three-finger-tap-js.svg)

A small (actually really small, around 4KB) library, that attempts to mimic the three finger tap behaviour exhibited when you 
tap on a URL with three fingers in Safari.

In Safari, when the user taps on a hyperlink using three fingers, a small preview window opens that shows the webpage the
link would have taken the use to. This library attempts to mimic that behaviour. But instead of using the three finger tap gesture to
open the URL preview window (as it is not available on all hardware), in desktop, the library makes use of timed hover gesture to achieve
the same.

In mobile, the user has to triple tap on a URL to open the preview window.

## Preview

### Desktop

![Desktop Demo](https://s19.postimg.org/ivqm47ddv/ezgif_com_video_to_gif_1.gif "Snippets Preview")

### Mobile
[Mobile Demo](https://s12.postimg.org/6jx9wh33x/ezgif-3450773392_copy.gif "Snippets Preview")

## Demo

You can try out the demo [here](https://sidthesloth92.github.io/three-finger-tap-js/demo.html).

## Installation
You can install the library as a dependency over NPM or you can simply download the release from the dist folder [here](https://github.com/sidthesloth92/three-finger-tap-js/tree/master/dist).

    npm i three-finger-tap-js

## Usage

1.Assign an appropriate class name to all the `<a>` (anchor) tags for which you wish to add the hover effect to.
```html
<a href="https://wikipedia.org" class="three-finger-tap">Link</a>
```
2.Add references to `threeFingerTap.min.js` and `threeFingerTap.min.css` to the HTML page.
```html

<link rel="stylesheet" href="../dist/css/threeFingerTap.min.css">

<script type="text/javascript" src="../dist/js/threeFingerTap.min.js"></script>
    
```
3.Call the library using the init method and see the magic happen.
```javascript
threeFingerTap.init({ 
    name : 'three-finger-tap', 
    hoverTimeout : 1000 // required only for desktop
})
```
## API

### Methods

`init`

Initializes the library and adds it to the window object with the name threeFingerTap. Use this method only once when you
load the page.

**Parameters** 

An object with name, hoverTimeout and customLoadingBackground as keys.

| Name | Description | Type | Required | Default |
| :--- | :---------- | :--: | :------: | :-----: |
| name | name of the CSS class name that will be used to identify the links to apply the hover effect on | String | yes | N/A |
| hoverTimeout | the duration for which a user needs to hover over an URL before the preview window appears. The value should be in milliseconds (Desktop only) | Number | yes |  Ignored and set to 500 for Mobile |
| customLoadingBackground | By default a loading background is added, you can use this parameter to set a custom image or gif as background. The value should be a valid value for the CSS `background-image` property. The path to the image/gif should be relative to page the effect will be displayed | String | no | N/A |

**Usage**

```javascript
threeFingerTap.init({ 
    name : 'class-name', 
    hoverTimeout : 1000, // required only for Desktop
    customLoadingBackground : "url('../assets/gifs/spinner.gif')"
})
```

All the three options can be specified either at the time the `init` function is called by passing them as parameters, or 
you can modify them any time after that using their corresponding getters and setters. All the three options are dynamic and changes 
reflect as soon as they are modified.

<hr />

`disable`

Disables the hover effect added by the library

**Usage**

```javascript
threeFingerTap.disable();
```

<hr />

`enable`

Enables the hover effect added by the library

**Usage**

```javascript
threeFingerTap.enable();
```

### Getter and Setters

**Usage**

| Name | Description | Parameters | Required | Parameter Type |
| :--- | :---------- | :--: | :------: | :-----: |
| getName | Returns the current value of the `name` option | N/A | N/A | N/A |
| setName | Updates the `name` value to the value passed as parameter | String | yes | A CSS valid class name |
| getHoverTimeout | Returns the current value of the `hoverTimeout` option | N/A | N/A | N/A |
| setHoverTimeout | Updates the `hoverTimeout` to the value passed as parameter for desktop. In case of mobile, ignore the parameter passed. | Number | yes | milliseconds |
| getCustomLoadingBackground | Returns the current value of the `customLoadingBackground` option | N/A | N/A | N/A |
| setCustomLoadingBackground | Sets the loading effect to the passed GIF/image | String | yes | A valid value for the CSS `background-image` property |

<hr />

`destroy`

Removes the DOM nodes and their respective event listeners. Also resets the library to the initial state.

**Usage**

```javascript
threeFingerTap.destroy();
```

# Browsers support

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |

# Contact
If you have any issues report them at [Issues](https://github.com/sidthesloth92/three-finger-tap-js/issues)

# Source
[Github](https://github.com/sidthesloth92/three-finger-tap-js)