const crypto = require('crypto')

const algorithm = 'aes-256-gcm'

module.exports = {
  encrypt: (data, secret, encoding = 'binary') => {
    const key = createKey(secret)

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    return Buffer.concat([iv, cipher.getAuthTag(), cipher.update(data), cipher.final()]).toString(encoding)
  },
  decrypt: (data, secret, encoding = 'binary') => {
    const key = createKey(secret)

    const payload = Buffer.from(data, encoding)

    const iv = payload.subarray(0, 16)

    const tag = payload.subarray(16, 32)

    const cipherText = payload.subarray(32)

    const cipher = crypto.createDecipheriv(algorithm, key, iv)

    cipher.setAuthTag(tag)

    return cipher.update(cipherText) + cipher.final()
  }
}

function createKey(secret) {
  return crypto
    .createHash('sha256')
    .update(secret)
    .digest()
}
