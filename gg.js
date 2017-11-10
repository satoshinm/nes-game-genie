'use strict';

const LETTER_VALUES = 'APZLGITYEOXUKSVN';

function toDigit(letter) {
  return LETTER_VALUES.indexOf(letter);
}

function toLetter(digit) {
  return LETTER_VALUES.substr(digit, 1);
}

function decode(code) {
  const digits = code.split('').map(toDigit);
  console.log(digits);

  let value = ((digits[0] & 8) << 4) + ((digits[1] & 7) << 4) + (digits[0] & 7);
  const address = ((digits[3] & 7) << 12) + ((digits[4] & 8) << 8) + ((digits[5] & 7) << 8) +
      ((digits[1] & 8) << 4) + ((digits[2] & 7) << 4) + (digits[3] & 8) + (digits[4] & 7);
  let key;

  if (digits.length == 8) {
    value += (digits[7] & 8);
    key = ((digits[6] & 8) << 4) + ((digits[7] & 7) << 4) + (digits[5] & 8) + (digits[6] & 7);
  } else {
    value += (digits[5] & 8);
  }
 
  const wantskey = !!(digits[2] >> 3);
  if (wantskey && digits.length != 8) {
    console.log(`warning: expected 8-letter code but only ${digits.length} letters`);
    // TODO: re-encode properly
  }

  console.log(`value: ${value}\naddress: ${address}\nkey: ${key}\n`)

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

module.exports = { encode, decode };

