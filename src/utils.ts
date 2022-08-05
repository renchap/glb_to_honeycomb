// from https://stackoverflow.com/a/21668344

export function dec2hex(str: string) {
  // .toString(16) only works up to 2^53
  const dec = str.toString().split("")

  const sum = []
  const hex = []
  let i: number
  let s: number

  while (dec.length) {
    // @ts-ignore
    s = 1 * dec.shift()

    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10
      sum[i] = s % 16
      s = (s - sum[i]) / 16
    }
  }

  while (sum.length) {
    // @ts-ignore
    hex.push(sum.pop().toString(16))
  }
  return hex.join("")
}
