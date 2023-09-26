const crypto = require('crypto');

module.exports = {
  encrypt: (data, secret, encoding = 'binary') => {
    const key = createKey(secret)

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

    const cipherText = Buffer.concat([cipher.update(data), cipher.final()])

    const tag = cipher.getAuthTag()

    return Buffer.concat([iv, tag, cipherText]).toString(encoding)
  },
  decrypt: (data, secret, encoding = 'binary') => {
    const key = createKey(secret)

    const payload = Buffer.from(data, encoding)

    const iv = payload.subarray(0, 16)

    const tag = payload.subarray(16, 32)

    const cipherText = payload.subarray(32)

    const cipher = crypto.createDecipheriv('aes-256-gcm', key, iv)

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
