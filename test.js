'use strict';

const test = require('tape');
const {decode, encode} = require('./');

test('decode no key', (t) => {
  t.equal(decode("SXIOPO").address, 0x11d9);
  t.equal(decode("SXIOPO").value, 0xad);
  t.equal(decode("SXIOPO").wantskey, false);
  t.equal(decode("SXIOPO").key, undefined);
  t.end();
});

test('decode with key', (t) => {
  t.equal(decode("SLXPLOVS").address, 0x1123);
  t.equal(decode("SLXPLOVS").value, 0xbd);
  t.equal(decode("SLXPLOVS").wantskey, true);
  t.equal(decode("SLXPLOVS").key, 0xde);
  t.end();
});
