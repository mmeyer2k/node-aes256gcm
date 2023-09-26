const crypto = require('crypto')

const pkcs7 = require('./pkcs7')

const algorithm = 'aes-256-gcm'

const engine = {
  encrypt: (data, secret, encoding = 'binary', padded = false) => {
    const key = createKey(secret)

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    const pad = padded ? pkcs7.padString(data) : ''

    const ciphertext = Buffer.concat([cipher.update(data + pad), cipher.final()])

    const tag = cipher.getAuthTag()

    return Buffer.concat([iv, tag, ciphertext]).toString(encoding)
  },
  decrypt: (data, secret, encoding = 'binary', padded = false) => {
    const key = createKey(secret)

    const payload = Buffer.from(data, encoding)

    const iv = payload.subarray(0, 16)

    const tag = payload.subarray(16, 32)

    const ciphertext = payload.subarray(32)

    const cipher = crypto.createDecipheriv(algorithm, key, iv)

    cipher.setAuthTag(tag)

    const plaintext = cipher.update(ciphertext) + cipher.final();

    return padded ? pkcs7.unpad(plaintext) : plaintext
  }
}

const padded = {
  encrypt: (data, secret, encoding = 'binary') => {
    return engine.encrypt(data, secret, encoding, true)
  },
  decrypt: (data, secret, encoding = 'binary') => {
    return engine.decrypt(data, secret, encoding, true)
  }
}

function createKey(secret) {
  return crypto
    .createHash('sha256')
    .update(secret)
    .digest()
}

module.exports = {...engine, padded}
