'use strict';

const LETTER_VALUES = 'APZLGITYEOXUKSVN';

function toDigit(letter) {
  return LETTER_VALUES.indexOf(letter);
}

function toLetter(digit) {
  return LETTER_VALUES.substr(digit, 1);
}

function isRawCode(code) {
  return !!code.match(/^([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?:([0-9a-fA-F]+)$/) ||
    !!code.match(/^([0-9a-fA-F]+):([0-9a-fA-F]+)(\?[0-9a-fA-F]*)?$/);
}

function isGGCode(code) {
  return !!code.match(/^[APZLGITYEOXUKSVN]{6}([APZLGITYEOXUKSVN]{2})?$/i);
}

function decodeGG(code) {
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

function encodeGG(address, value, key, wantskey) {
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

function encodeRaw(address, value, key, wantskey) {
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

function decodeRaw(s) {
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

module.exports = { encodeGG, decodeGG, encodeRaw, decodeRaw, isRawCode, isGGCode };

