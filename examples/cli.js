#!/usr/bin/env node
'use strict';

const { encode, decode, encodeHex, decodeHex } = require('../');

if (process.argv.length < 3) {
  process.stderr.write(`NES Game Genie encoder/decoder
Usage: node cli.js code

code: a Game Genie code or hex code
`);
  process.exit(1);
}

const code = process.argv.slice(2)[0];
process.stdout.write(`Input:    ${code}\n\n`);

const decoded = decode(code);
//console.log(decoded);
process.stdout.write(`Address:  ${decoded.address.toString(16)}\n`);
if (decoded.key !== undefined) {
  process.stdout.write(`Key:      ${decoded.key.toString(16)}\n`);
}
process.stdout.write(`Wantskey  ${decoded.wantskey}\n`);
process.stdout.write(`Value:    ${decoded.value.toString(16)}\n`);
process.stdout.write(`\n`);

const hexCode = encodeHex(decoded.address, decoded.value, decoded.key, decoded.wantskey);
process.stdout.write(`Hex code: ${hexCode}\n`);

const ggCode = encode(decoded.address, decoded.value, decoded.key, decoded.wantskey);
process.stdout.write(`GG code:  ${ggCode}\n`);

