# nes-game-genie

Game Genie decoder/encoder for Nintendo Entertainment System (npmjs module)

**[Web-based example](https://satoshinm.github.io/nes-game-genie/)**

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

### Command-line interface (cli.js)

Passing a Game Genie or raw code will decode and re-encode:

    nes-game-genie $ examples/cli.js SLXPLOVS
    Input:    SLXPLOVS

    Address:  1123
    Key:      de
    Wantskey  true
    Value:    bd

    Hex code: 1123?de:bd
    GG code:  SLXPLOVS
    nes-game-genie $ examples/cli.js 1123?de:bd
    Input:    1123?de:bd

    Address:  1123
    Key:      de
    Wantskey  true
    Value:    bd

    Hex code: 1123?de:bd
    GG code:  SLXPLOVS

## License

MIT
