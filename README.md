# nes-game-genie

Game Genie decoder/encoder for Nintendo Entertainment System (npmjs module)

Example:

    const {encode, decode} = require('nes-game-genie');

    console.log(decode('SLXPLOVS')); // { value: 189, address: 4387, wantskey: true, key: 222 }
    console.log(decode('SXIOPO')); // { value: 173, address: 4569, wantskey: false, key: undefined }
    console.log(encode(0x1123, 0xbd, 0xde)); // SLXPLOVS

Decodes NES Game Genie codes to the address/value/key, and vice versa. Hex-style codes are also supported:

    const {encodeHex, decodeHex} = require('nes-game-genie');

    console.log(encodeHex(0x1123, 0xbd, 0xde)); // 1123:bd?de
    console.log(decodeHex('1123:bd?de')); // { value: 189, address: 4387, wantskey: true, key: 222 }
    console.log(decode('1123:bd?de')); // { value: 189, address: 4387, wantskey: true, key: 222 }

## License

MIT
