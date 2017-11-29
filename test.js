'use strict';

const test = require('tape');
const {decode, encode, encodeHex, decodeHex} = require('./');

test('decode no key', (t) => {
  t.equal(decode('SXIOPO').address, 0x11d9);
  t.equal(decode('SXIOPO').value, 0xad);
  t.equal(decode('SXIOPO').wantskey, false);
  t.equal(decode('SXIOPO').key, undefined);
  t.end();
});

test('decode with key', (t) => {
  t.equal(decode('SLXPLOVS').address, 0x1123);
  t.equal(decode('SLXPLOVS').value, 0xbd);
  t.equal(decode('SLXPLOVS').wantskey, true);
  t.equal(decode('SLXPLOVS').key, 0xde);
  t.end();
});

test('decode lowercase', (t) => {
  t.equal(decode('slxplovs').address, 0x1123);
  t.equal(decode('slxplovs').value, 0xbd);
  t.equal(decode('slxplovs').wantskey, true);
  t.equal(decode('slxplovs').key, 0xde);
  t.end();
});


test('encode no key', (t) => {
  t.equal(encode(0x11d9, 0xad), 'SXIOPO');
  t.equal(decode(encode(0x11d9, 0xad)).address, 0x11d9);
  t.equal(decode(encode(0x11d9, 0xad)).value, 0xad);
  t.equal(decode(encode(0x11d9, 0xad)).wantskey, false);
  t.equal(decode(encode(0x11d9, 0xad)).key, undefined);
  t.end();
});

test('encode no key but wants key', (t) => {
  t.equal(encode(0x11d9, 0xad, undefined, true), 'SXSOPO');
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).address, 0x11d9);
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).value, 0xad);
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).wantskey, true);
  t.equal(decode(encode(0x11d9, 0xad, undefined, true)).key, undefined);
  t.end();
});

test('encode with key', (t) => {
  t.equal(encode(0x1123, 0xbd, 0xde), 'SLXPLOVS');
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).address, 0x1123);
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).value, 0xbd);
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).wantskey, true);
  t.equal(decode(encode(0x1123, 0xbd, 0xde)).key, 0xde);
  t.end();
});

test('encode hex', (t) => {
  t.equal(encodeHex(0x1123, 0xbd), '1123:bd');
  t.equal(encodeHex(0x1123, 0xbd, 0xde), '1123?de:bd');
  t.equal(encodeHex(0x1123, 0xbd, undefined, true), '1123?:bd');

  t.equal(encodeHex(0x0123, 0x0b, 0x0e), '0123?0e:0b');
  t.equal(encodeHex(0x0000, 0x00, 0x00), '0000?00:00');
  t.end();
});

test('decode hex', (t) => {
  t.equal(decodeHex('1123?de:bd').address, 0x1123);
  t.equal(decodeHex('1123?de:bd').value, 0xbd);
  t.equal(decodeHex('1123?de:bd').key, 0xde);
  t.equal(decodeHex('1123?de:bd').wantskey, true);

  t.equal(decodeHex('1123:bd').address, 0x1123);
  t.equal(decodeHex('1123:bd').value, 0xbd);
  t.equal(decodeHex('1123:bd').key, undefined);
  t.equal(decodeHex('1123:bd').wantskey, false);

  t.equal(decodeHex('1123?:bd').address, 0x1123);
  t.equal(decodeHex('1123?:bd').value, 0xbd);
  t.equal(decodeHex('1123?:bd').key, undefined);
  t.equal(decodeHex('1123?:bd').wantskey, true);

  t.equal(decodeHex('DEAD?DE:BD').address, 0xdead);
  t.equal(decodeHex('DEAD?DE:BD').value, 0xbd);
  t.equal(decodeHex('DEAD?DE:BD').key, 0xde);
  t.equal(decodeHex('DEAD?DE:BD').wantskey, true);

  t.equal(decodeHex('0123?0e:0b').address, 0x0123);
  t.equal(decodeHex('0123?0e:0b').value, 0x0b);
  t.equal(decodeHex('0123?0e:0b').key, 0x0e);
  t.equal(decodeHex('0123?0e:0b').wantskey, true);

  t.equal(decodeHex('0000?00:00').address, 0x0000);
  t.equal(decodeHex('0000?00:00').value, 0x00);
  t.equal(decodeHex('0000?00:00').key, 0x00);
  t.equal(decodeHex('0000?00:00').wantskey, true);

  t.end();
});

test('decode hex with decode()', (t) => {
  t.equal(decode('1123?de:bd').address, 0x1123);
  t.equal(decode('1123?de:bd').value, 0xbd);
  t.equal(decode('1123?de:bd').key, 0xde);
  t.equal(decode('1123?de:bd').wantskey, true);

  t.equal(decode('1123:bd').address, 0x1123);
  t.equal(decode('1123:bd').value, 0xbd);
  t.equal(decode('1123:bd').key, undefined);
  t.equal(decode('1123:bd').wantskey, false);

  t.end();
});

test('decode hex (key after)', (t) => {
  t.equal(decodeHex('1123:bd?de').address, 0x1123);
  t.equal(decodeHex('1123:bd?de').value, 0xbd);
  t.equal(decodeHex('1123:bd?de').key, 0xde);
  t.equal(decodeHex('1123:bd?de').wantskey, true);

  t.equal(decodeHex('1123:bd?').address, 0x1123);
  t.equal(decodeHex('1123:bd?').value, 0xbd);
  t.equal(decodeHex('1123:bd?').key, undefined);
  t.equal(decodeHex('1123:bd?').wantskey, true);

  t.equal(decodeHex('DEAD:BD?DE').address, 0xdead);
  t.equal(decodeHex('DEAD:BD?DE').value, 0xbd);
  t.equal(decodeHex('DEAD:BD?DE').key, 0xde);
  t.equal(decodeHex('DEAD:BD?DE').wantskey, true);

  t.equal(decodeHex('0123:0b?0e').address, 0x0123);
  t.equal(decodeHex('0123:0b?0e').value, 0x0b);
  t.equal(decodeHex('0123:0b?0e').key, 0x0e);
  t.equal(decodeHex('0123:0b?0e').wantskey, true);

  t.equal(decodeHex('0000:00?00').address, 0x0000);
  t.equal(decodeHex('0000:00?00').value, 0x00);
  t.equal(decodeHex('0000:00?00').key, 0x00);
  t.equal(decodeHex('0000:00?00').wantskey, true);

  t.end();
});

test('decode hex with decode() (key after)', (t) => {
  t.equal(decode('1123:bd?de').address, 0x1123);
  t.equal(decode('1123:bd?de').value, 0xbd);
  t.equal(decode('1123:bd?de').key, 0xde);
  t.equal(decode('1123:bd?de').wantskey, true);

  t.end();
});
