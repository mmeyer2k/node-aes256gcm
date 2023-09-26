# node-aes256gcm
Wrappers for AES256 GCM authenticated encryption functions.
GCM is widely considered to be the most optimal choice for projects needing symmetric encryption.

## Install
```bash
yarn install aes256gcm
```

## Usage
A trivial example of usage is shown below.
The resulting `encrypted` variable will contain the raw binary encrypted message as an opaque blob also containing the IV and auth tag.

```javascript
const gcm = require('aes256gcm')

const key = "A".repeat(32) // please see keys section

const encrypted = gcm.encrypt('my secret message', key)
```

## Encoding
By default, no input/output encoding is used.
However, this will often be unusable in binary unsafe contexts. 
Passing the `encoding` parameter will allow for native encoding/decoding with formats supported by `ToString()`.

```javascript
const encrypted = gcm.encrypt('my secret message', key, 'hex')
const decrypted = gcm.decrypt(encrypted, key, 'hex')
```

```javascript
const encrypted = gcm.encrypt('my secret message', key, 'base64')
const decrypted = gcm.decrypt(encrypted, key, 'base64')
```

## Padding
GCM does not pad input data by default.
This can leak information about the size of plaintexts.
To pad input to block length, use the `padded` helper object:
```javascript
const encrypted = gcm.padded.encrypt('my secret message', key, 'base64')
const decrypted = gcm.padded.decrypt(encrypted, key, 'base64')
```

## Keys
Keys are required to be exactly 32 bytes.
The strength of this key determines the security of your data.
No key hardening is performed within this library.
Anything other than a completely random password will leave encrypted data in a vulnerable state.

Generate a key:

```javascript
const gcm = require('aes256gcm')

const crypto = require('crypto')

let key = crypto.randomBytes(32).toString('base64');

console.log(key)

key = Buffer.from(key, 'base64').toString('ascii')

const encrypted = gcm.encrypt('my secret message', key)
```