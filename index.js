const crypto = require('crypto')

const pkcs7 = require('./pkcs7')

const algorithm = 'aes-256-gcm'

const engine = {
  encrypt: (data, key, padded = false) => {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    const pad = padded ? pkcs7.pad(data) : ''

    const ciphertext = Buffer.concat([cipher.update(data + pad), cipher.final()])

    const tag = cipher.getAuthTag()

    return Buffer.concat([iv, tag, ciphertext])
  },
  decrypt: (data, key, padded = false) => {
    const iv = data.subarray(0, 16)

    const tag = data.subarray(16, 32)

    const ciphertext = data.subarray(32)

    const cipher = crypto.createDecipheriv(algorithm, key, iv)

    cipher.setAuthTag(tag)

    const plaintext = Buffer.concat([cipher.update(ciphertext), cipher.final()]);

    return padded ? pkcs7.unpad(plaintext) : plaintext
  }
}

const padded = {
  encrypt: (data, secret) => {
    return engine.encrypt(data, secret, true)
  },
  decrypt: (data, secret) => {
    return engine.decrypt(data, secret, true)
  }
}

module.exports = {...engine, padded}
