const gcm = require('./index')
const crypto = require('crypto')

const a = 'AAAAAAAA'
const b = 'X'.repeat(32)

test('basic encryption test (binary)', () => {
  const c = gcm.encrypt(a, b)
  const d = gcm.decrypt(c, b).toString()
  expect(d).toBe(a)
})

test('basic encryption test (hex)', () => {
  const c = gcm.encrypt(a, b).toString('hex')
  const d = gcm.decrypt(Buffer.from(c, 'hex'), b).toString()
  expect(d).toBe(a)
})

test('basic encryption test (base64)', () => {
  const c = gcm.encrypt(a, b).toString('base64')
  const d = gcm.decrypt(Buffer.from(c, 'base64'), b).toString()
  expect(d).toBe(a)
})

test('test buffered data', () => {
  const k = Buffer.from("A".repeat(4))
  const c = gcm.encrypt(k, b)
  const d = gcm.decrypt(c, b)
  expect(d.toString()).toBe(k.toString())
})

test('test buffered key', () => {
  const k = Buffer.from(crypto.randomBytes(32).toString('base64'), 'base64')
  const c = gcm.encrypt(a, k)
  const d = gcm.decrypt(c, k).toString()
  expect(d).toBe(a)
})

for (var i = 0; i < 1000; i++) {
  test('stress test #' + i, () => {
    const k = "K".repeat(i)
    const c = gcm.encrypt(k, b)
    const d = gcm.decrypt(c, b).toString()
    expect(d).toBe(k)
  })
}

for (var i = 0; i < 1000; i++) {
  test('stress test (padded) #' + i, () => {
    const k = "K".repeat(i)
    const c = gcm.padded.encrypt(k, b)
    const d = gcm.padded.decrypt(c, b).toString()
    expect(d).toBe(k)
    expect(c.length % 32).toBe(0)
  })
}

for (var i = 0; i < 1000; i++) {
  test('stress test (random) #' + i, () => {
    const k = crypto.randomBytes(i)
    const c = gcm.encrypt(k, b)
    const d = gcm.decrypt(c, b)
    expect(d.toString()).toBe(k.toString())
  })
}

for (var i = 0; i < 1000; i++) {
  test('stress test (random/padded) #' + i, () => {
    const k = crypto.randomBytes(i)
    const c = gcm.padded.encrypt(k, b)
    const d = gcm.padded.decrypt(c, b)
    expect(d.toString()).toBe(k.toString())
  })
}
