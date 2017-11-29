# nes-game-genie

Game Genie decoder/encoder for Nintendo Entertainment System (npmjs module)

**[Web-based example](https://satoshinm.github.io/nescode/)**

Code examples:

    const {encodeGG, decodeGG} = require('nes-game-genie');

    console.log(decodeGG('SLXPLOVS')); // { value: 189, address: 4387, wantskey: true, key: 222 }
    console.log(decodeGG('SXIOPO')); // { value: 173, address: 4569, wantskey: false, key: undefined }
    console.log(encodeGG(0x1123, 0xbd, 0xde)); // SLXPLOVS

Decodes NES Game Genie codes to the address/value/key, and vice versa. "Raw" style codes are also supported:

    const {encodeHex, decodeHex} = require('nes-game-genie');

    console.log(encodeHex(0x1123, 0xbd, 0xde)); // 1123?de:bd
    console.log(decodeHex('1123?de:bd')); // { value: 189, address: 4387, wantskey: true, key: 222 }
    console.log(decodeGG('1123?de:bd')); // { value: 189, address: 4387, wantskey: true, key: 222 }

To check for the code type, you can use `isRawCode` and `isGGCode`.

## License

MIT
