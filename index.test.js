const gcm = require('./index')
const crypto = require('crypto')

const a = 'AAAA'
const b = 'BBBB'

test('basic encryption test (binary)', () => {
  const c = gcm.encrypt(a, b)
  const d = gcm.decrypt(c, b)
  expect(d).toBe(a)
})

test('basic encryption test (hex)', () => {
  const c = gcm.encrypt(a, b, 'hex')
  const d = gcm.decrypt(c, b, 'hex')
  expect(d).toBe(a)
})

test('basic encryption test (base64)', () => {
  const c = gcm.encrypt(a, b, 'base64')
  const d = gcm.decrypt(c, b, 'base64')
  expect(d).toBe(a)
})

for (var i = 0; i < 1000; i++) {
  test('stress test #' + i, () => {
    const k = "K".repeat(i)
    const c = gcm.encrypt(k, b)
    const d = gcm.decrypt(c, b)
    expect(d).toBe(k)
  })
}

for (var i = 0; i < 1000; i++) {
  test('stress test (padded) #' + i, () => {
    const k = "K".repeat(i)
    const c = gcm.padded.encrypt(k, b, 'base64')
    const d = gcm.padded.decrypt(c, b, 'base64')
    expect(d).toBe(k)
    expect(c.length % 32).toBe(0)
  })
}

for (var i = 0; i < 1000; i++) {
  test('stress test (random) #' + i, () => {
    const k = crypto.randomBytes(i).toString()
    const c = gcm.encrypt(k, b)
    const d = gcm.decrypt(c, b)
    expect(d).toBe(k)
  })
}

for (var i = 0; i < 1000; i++) {
  test('stress test (random/padded) #' + i, () => {
    const k = crypto.randomBytes(i).toString()
    const c = gcm.padded.encrypt(k, b)
    const d = gcm.padded.decrypt(c, b)
    expect(d).toBe(k)
  })
}