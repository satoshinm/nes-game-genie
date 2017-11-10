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

test('encode no key', (t) => {
  t.equal(encode(0x11d9, 0xad), "SXIOPO");
  t.equal(decode(encode(0x11d9, 0xad)).address, 0x11d9);
  t.equal(decode(encode(0x11d9, 0xad)).value, 0xad);
  t.equal(decode(encode(0x11d9, 0xad)).wantskey, false);
  t.equal(decode(encode(0x11d9, 0xad)).key, undefined);
  t.end();
});

test('encode no key but wants key', (t) => {
  t.equal(encode(0x11d9, 0xad, undefined, true), "SXSOPO");
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).address, 0x11d9);
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).value, 0xad);
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).wantskey, true);
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).key, undefined);
  t.end();
});

test('encode with key', (t) => {
  t.equal(encode(0x1123, 0xbd, 0xde), "SLXPLOVS");
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).address, 0x1123);
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).value, 0xbd);
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).wantskey, true);
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).key, 0xde);
  t.end();
});
