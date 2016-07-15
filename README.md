# three-finger-tap-js
A small (actually really small, around 1KB) library, that attempts to mimic the three finger tap behaviour exhibited when you 
tap on a URL with three fingers in Safari.

In Safari, when the user taps on a hyperlink using three fingers, a small preview window opens that shows the webpage the
link would have taken the use to. This library attempts to mimic that behaviour. But instead of using the three finger tap gesture to
open the URL preview window (as it is not available on all hardware), the library makes use of timed hover gesture to achieve
the same.

## Preview

![alt text](http://i.imgur.com/gDTPCeC.gifv "Snippets Preview")

## Demo
You can see a demo [here]().

## Installation
You can install the library as a dependency over NPM or you can simply download the release from [here]().

    npm i three-finger-tap-js

## Usage

1. Add reference to `threeFingerTap.min.js` and `threeFingerTap.min.css` to the HTML page you wish to add the effect to.
```html
<a href="https://wikipedia.org" class="three-finger-tap">Link</a>
```
2. Call the library using the init method and see the magic happen
```javascript
threeFingerTap.init({ 
    name : 'three-finger-tap', 
    hoverTimeout : 1000
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
| hoverTimeout | the duration for which a user needs to hover over an URL before the preview window appears. The value should be in milliseconds | Number | no | 2000 |
| customLoadingBackground | By default a loading background is added, you can use this parameter to set a custom image or gif as background. The value should be a valid value for the CSS `background-image` property. The path to the image/gif should be relative to page the effect will be displayed | String | no | N/A |

**Usage**

```javascript
threeFingerTap.init({ 
    name : 'class-name', 
    hoverTimeout : 1000,
    customLoadingBackground : "url('../assets/gifs/spinner.gif')"
})
```

All the three options can be specified either at the time the `init` function is called by passing them as parameters, or 
you can modify them any time after that using their corresponding getters and setters. All the three options are dynamic and changes 
reflect as soon as they are modified.

`disable`

Disables the hover effect added by the library

**Usage**

```javascript
threeFingerTap.disable();
```

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
| setHovertimeout | Updates the `hoverTimeout` to the value passed as parameter | Number | yes | milliseconds |
| getCustomLoadingBackground | Returns the current value of the `customLoadingBackground` option | N/A | N/A | N/A |
| setCustomLoadingBackground | Sets the loading effect to the passed GIF/image | String | yes | A valid value for the CSS `background-image` property |

# Contact
If you have any issues report them at [Issues](https://github.com/sidthesloth92/three-finger-tap-js/issues)

# Source
[Github](https://github.com/sidthesloth92/three-finger-tap-js)