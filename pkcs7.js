module.exports = {
  padString: (data) => {
    const length = 32 - (data.length % 32);

    return String.fromCharCode(length).repeat(length)
  },
  unpad: (data) => {
    const size = data.charCodeAt(data.length - 1)

    return data.substring(0, data.length - size)
  }
}