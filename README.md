# nes-game-genie

Game Genie decoder/encoder for Nintendo Entertainment System (npmjs module)

Example:

    const {encode, decode} = require('nes-game-genie');

    console.log(decode('SLXPLOVS')); // { value: 189, address: 4387, wantskey: true, key: 222 }
    console.log(decode('SXIOPO')); // { value: 173, address: 4569, wantskey: false, key: undefined }
    console.log(encode(0x1123, 0xbd, 0xde)); // SLXPLOVS

Decodes NES Game Genie codes to the address/value/key, and vice versa.

## License

MIT
