const gcm = require('./index')

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