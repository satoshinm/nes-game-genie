/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { encode, decode, encodeHex, decodeHex } = __webpack_require__(1);

const textarea = document.createElement('textarea');

textarea.value = 'SLXPLOVS';

textarea.cols = 10;
textarea.rows = 10;

const output = document.createElement('p');

function update() {
  output.innerHTML = '';

  for (let input of textarea.value.split('\n')) {
    const decoded = decode(input);

    let outputLine;

    if (decoded) {
      const gg = encode(decoded.address, decoded.value, decoded.key, decoded.wantskey);
      const hex = encodeHex(decoded.address, decoded.value, decoded.key, decoded.wantskey);

      outputLine = `${input} = ${gg} ${hex}`;
    } else {
      outputLine = `${input} invalid`;
    }

    output.appendChild(document.createTextNode(outputLine));
    output.appendChild(document.createElement('br'));
  }
}

document.body.addEventListener('keyup', update);
update();

const div = document.createElement('div');
div.appendChild(textarea);
div.appendChild(output);

document.body.appendChild(div);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const LETTER_VALUES = 'APZLGITYEOXUKSVN';

function toDigit(letter) {
  return LETTER_VALUES.indexOf(letter);
}

function toLetter(digit) {
  return LETTER_VALUES.substr(digit, 1);
}

function decode(code) {
  if (code.indexOf(':') !== -1) return decodeHex(code);

  const digits = code.toUpperCase().split('').map(toDigit);

  let value = ((digits[0] & 8) << 4) + ((digits[1] & 7) << 4) + (digits[0] & 7);
  const address = ((digits[3] & 7) << 12) + ((digits[4] & 8) << 8) + ((digits[5] & 7) << 8) +
      ((digits[1] & 8) << 4) + ((digits[2] & 7) << 4) + (digits[3] & 8) + (digits[4] & 7);
  let key;

  if (digits.length === 8) {
    value += (digits[7] & 8);
    key = ((digits[6] & 8) << 4) + ((digits[7] & 7) << 4) + (digits[5] & 8) + (digits[6] & 7);
  } else {
    value += (digits[5] & 8);
  }
 
  const wantskey = !!(digits[2] >> 3);

  return { value, address, wantskey, key };
}

function encode(address, value, key, wantskey) {
  let digits = Array(6);

  digits[0] = (value & 7) + ((value >> 4) & 8);
  digits[1] = ((value >> 4) & 7) + ((address >> 4) & 8);
  digits[2] = ((address >> 4) & 7);
  digits[3] = (address >> 12) + (address & 8);
  digits[4] = (address & 7) + ((address >> 8) & 8);
  digits[5] = ((address >> 8) & 7);

  if (key === undefined) {
    digits[5] += value & 8;
    if (wantskey) digits[2] += 8;
  } else {
    digits[2] += 8;
    digits[5] += key & 8;
    digits[6] = (key & 7) + ((key >> 4) & 8);
    digits[7] = ((key >> 4) & 7) + (value & 8);
  }

  const code = digits.map(toLetter).join('');

  return code;
}

function toHex(n, width) {
  const s = n.toString(16);
  return '0000'.substring(0, width - s.length) + s;
}

function encodeHex(address, value, key, wantskey) {
  let s = toHex(address, 4);

  if (key !== undefined || wantskey) {
    s += '?';
  }

  if (key !== undefined) {
    s += toHex(key, 2);
  }

  s += ':' + toHex(value, 2);

  return s;
}

function decodeHex(s) {
  // Conventional address?key:value
  let match = s.match(/^([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?:([0-9a-fA-F]+)$/);
  if (match) {
    const address = parseInt(match[1], 16);
    const wantskey = match[2] !== undefined;
    const key = (match[2] !== undefined && match[2].length > 1) ? parseInt(match[2].substring(1), 16) : undefined;
    const value = parseInt(match[3], 16);

    return { value, address, wantskey, key };
  }

  // Non-standard but acceptable address:value?key
  match = s.match(/^([0-9a-fA-F]+):([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?$/);
  if (match) {
    const address = parseInt(match[1], 16);
    const value = parseInt(match[2], 16);
    const wantskey = match[3] !== undefined;
    const key = (match[3] !== undefined && match[3].length > 1) ? parseInt(match[3].substring(1), 16) : undefined;

    return { value, address, wantskey, key };
  }

  return null;
}

module.exports = { encode, decode, encodeHex, decodeHex };



/***/ })
/******/ ]);