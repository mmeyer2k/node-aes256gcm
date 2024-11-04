# node-aes256gcm
Wrappers for AES256 GCM authenticated encryption functions.
GCM is widely considered to be the most optimal choice for projects needing symmetric encryption.

## Install
```bash
yarn add aes256gcm
```

## Usage
A trivial example of usage is shown below.
The resulting `encrypted` variable will be a buffer containing the encrypted message, IV and auth tag.

```javascript
const gcm = require('aes256gcm')

const key = "A".repeat(32) // please see "Keys" section

const encrypted = gcm.encrypt('my secret message', key)
```

## Encoding
Buffers are always returned by the encrypt/decrypt functions.
If special encoding is needed, use the `toString()` method.

```javascript
const encrypted = gcm.encrypt('my secret message', key).toString('base64')
```
Input data can either be provided as a string or as a buffer.
By default, strings will be treated as UTF-8.
```javascript
const decrypted = gcm.decrypt(Buffer.from(encrypted, 'base64'), key)
```

## Padding
GCM does not pad input data by default.
This can leak information about the size of plaintexts.
To pad input to block length, use the `padded` helper object:
```javascript
const encrypted = gcm.padded.encrypt('my secret message', key)

const decrypted = gcm.padded.decrypt(encrypted, key)
```

## Keys
Keys are required to be exactly 32 bytes.
The strength of this key determines the security of your data.
No key hardening is performed within this library.
Anything other than a completely random password will leave encrypted data in a vulnerable state.

Generate a new base64 encoded key the javascript way:

```javascript
const gcm = require('aes256gcm')

const crypto = require('crypto')

let key = crypto.randomBytes(32).toString('base64');

console.log(key)
```
Use the encoded key:
```javascript
const key = Buffer.from(key, 'base64')

const encrypted = gcm.encrypt('my secret message', key)
```
