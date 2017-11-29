'use strict';

const test = require('tape');
const {decodeGG, encodeGG, encodeRaw, decodeRaw, isRawCode, isGGCode} = require('./');

test('decodeGG no key', (t) => {
  t.equal(decodeGG('SXIOPO').address, 0x11d9);
  t.equal(decodeGG('SXIOPO').value, 0xad);
  t.equal(decodeGG('SXIOPO').wantskey, false);
  t.equal(decodeGG('SXIOPO').key, undefined);
  t.end();
});

test('decodeGG with key', (t) => {
  t.equal(decodeGG('SLXPLOVS').address, 0x1123);
  t.equal(decodeGG('SLXPLOVS').value, 0xbd);
  t.equal(decodeGG('SLXPLOVS').wantskey, true);
  t.equal(decodeGG('SLXPLOVS').key, 0xde);
  t.end();
});

test('decodeGG lowercase', (t) => {
  t.equal(decodeGG('slxplovs').address, 0x1123);
  t.equal(decodeGG('slxplovs').value, 0xbd);
  t.equal(decodeGG('slxplovs').wantskey, true);
  t.equal(decodeGG('slxplovs').key, 0xde);
  t.end();
});


test('encodeGG no key', (t) => {
  t.equal(encodeGG(0x11d9, 0xad), 'SXIOPO');
  t.equal(decodeGG(encodeGG(0x11d9, 0xad)).address, 0x11d9);
  t.equal(decodeGG(encodeGG(0x11d9, 0xad)).value, 0xad);
  t.equal(decodeGG(encodeGG(0x11d9, 0xad)).wantskey, false);
  t.equal(decodeGG(encodeGG(0x11d9, 0xad)).key, undefined);
  t.end();
});

test('encodeGG no key but wants key', (t) => {
  t.equal(encodeGG(0x11d9, 0xad, undefined, true), 'SXSOPO');
  t.equal(decodeGG(encodeGG(0x11d9, 0xad, undefined, true)).address, 0x11d9);
  t.equal(decodeGG(encodeGG(0x11d9, 0xad, undefined, true)).value, 0xad);
  t.equal(decodeGG(encodeGG(0x11d9, 0xad, undefined, true)).wantskey, true);
  t.equal(decodeGG(encodeGG(0x11d9, 0xad, undefined, true)).key, undefined);
  t.end();
});

test('encodeGG with key', (t) => {
  t.equal(encodeGG(0x1123, 0xbd, 0xde), 'SLXPLOVS');
  t.equal(decodeGG(encodeGG(0x1123, 0xbd, 0xde)).address, 0x1123);
  t.equal(decodeGG(encodeGG(0x1123, 0xbd, 0xde)).value, 0xbd);
  t.equal(decodeGG(encodeGG(0x1123, 0xbd, 0xde)).wantskey, true);
  t.equal(decodeGG(encodeGG(0x1123, 0xbd, 0xde)).key, 0xde);
  t.end();
});

test('encodeGG hex', (t) => {
  t.equal(encodeRaw(0x1123, 0xbd), '1123:bd');
  t.equal(encodeRaw(0x1123, 0xbd, 0xde), '1123?de:bd');
  t.equal(encodeRaw(0x1123, 0xbd, undefined, true), '1123?:bd');

  t.equal(encodeRaw(0x0123, 0x0b, 0x0e), '0123?0e:0b');
  t.equal(encodeRaw(0x0000, 0x00, 0x00), '0000?00:00');
  t.end();
});

test('decodeGG hex', (t) => {
  t.equal(decodeRaw('1123?de:bd').address, 0x1123);
  t.equal(decodeRaw('1123?de:bd').value, 0xbd);
  t.equal(decodeRaw('1123?de:bd').key, 0xde);
  t.equal(decodeRaw('1123?de:bd').wantskey, true);

  t.equal(decodeRaw('1123:bd').address, 0x1123);
  t.equal(decodeRaw('1123:bd').value, 0xbd);
  t.equal(decodeRaw('1123:bd').key, undefined);
  t.equal(decodeRaw('1123:bd').wantskey, false);

  t.equal(decodeRaw('1123?:bd').address, 0x1123);
  t.equal(decodeRaw('1123?:bd').value, 0xbd);
  t.equal(decodeRaw('1123?:bd').key, undefined);
  t.equal(decodeRaw('1123?:bd').wantskey, true);

  t.equal(decodeRaw('DEAD?DE:BD').address, 0xdead);
  t.equal(decodeRaw('DEAD?DE:BD').value, 0xbd);
  t.equal(decodeRaw('DEAD?DE:BD').key, 0xde);
  t.equal(decodeRaw('DEAD?DE:BD').wantskey, true);

  t.equal(decodeRaw('0123?0e:0b').address, 0x0123);
  t.equal(decodeRaw('0123?0e:0b').value, 0x0b);
  t.equal(decodeRaw('0123?0e:0b').key, 0x0e);
  t.equal(decodeRaw('0123?0e:0b').wantskey, true);

  t.equal(decodeRaw('0000?00:00').address, 0x0000);
  t.equal(decodeRaw('0000?00:00').value, 0x00);
  t.equal(decodeRaw('0000?00:00').key, 0x00);
  t.equal(decodeRaw('0000?00:00').wantskey, true);

  t.equal(decodeRaw('0?0:0').address, 0);
  t.equal(decodeRaw('0?0:0').value, 0);
  t.equal(decodeRaw('0?0:0').key, 0);
  t.equal(decodeRaw('0?0:0').wantskey, true);

  t.equal(decodeRaw('0:0').address, 0);
  t.equal(decodeRaw('0:0').value, 0);
  t.equal(decodeRaw('0:0').wantskey, false);

  t.equal(decodeRaw(':'), null);

  t.end();
});

test('decodeGG hex (key after)', (t) => {
  t.equal(decodeRaw('1123:bd?de').address, 0x1123);
  t.equal(decodeRaw('1123:bd?de').value, 0xbd);
  t.equal(decodeRaw('1123:bd?de').key, 0xde);
  t.equal(decodeRaw('1123:bd?de').wantskey, true);

  t.equal(decodeRaw('1123:bd?').address, 0x1123);
  t.equal(decodeRaw('1123:bd?').value, 0xbd);
  t.equal(decodeRaw('1123:bd?').key, undefined);
  t.equal(decodeRaw('1123:bd?').wantskey, true);

  t.equal(decodeRaw('DEAD:BD?DE').address, 0xdead);
  t.equal(decodeRaw('DEAD:BD?DE').value, 0xbd);
  t.equal(decodeRaw('DEAD:BD?DE').key, 0xde);
  t.equal(decodeRaw('DEAD:BD?DE').wantskey, true);

  t.equal(decodeRaw('0123:0b?0e').address, 0x0123);
  t.equal(decodeRaw('0123:0b?0e').value, 0x0b);
  t.equal(decodeRaw('0123:0b?0e').key, 0x0e);
  t.equal(decodeRaw('0123:0b?0e').wantskey, true);

  t.equal(decodeRaw('0000:00?00').address, 0x0000);
  t.equal(decodeRaw('0000:00?00').value, 0x00);
  t.equal(decodeRaw('0000:00?00').key, 0x00);
  t.equal(decodeRaw('0000:00?00').wantskey, true);

  t.end();
});

test('is code', (t) => {
  t.equal(isRawCode('0:0'), true);
  t.equal(isRawCode('0?0:0'), true);
  t.equal(isRawCode('0:0?0'), true);
  t.equal(isGGCode('SXIOP'), false);
  t.equal(isGGCode('SXIOPO'), true);
  t.equal(isGGCode('SLXPLOVS'), true);
  t.equal(isGGCode('SLXPLOV'), false);
  t.equal(isGGCode('slxplovs'), true);
  t.equal(isGGCode('SLXPLOVSX'), false);
  t.end();
});
