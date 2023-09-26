module.exports = {
  pad: data => {
    const length = 32 - (data.length % 32);

    return String.fromCharCode(length).repeat(length)
  },
  unpad: (data) => {
    const size = data[data.length - 1]

    return data.subarray(0, data.length - size)
  }
}