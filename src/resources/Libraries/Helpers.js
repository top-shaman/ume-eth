import Web3 from 'web3'


export const toBytes = async (s) => {
  return await window.web3.utils.fromAscii(s)
}
export const fromBytes = async (b) => {
  return await window.web3.utils.toUtf8(b)
}

export const isolatePlain = async text => {
  const regex = /((([^@#](?=\w)*)|([@#](?!\w))))(?<!(([@]\w{1,31})|([#]\w+)))([^@#]|([@#](?!\w)))*/g,
        plainMap = []
  let exec
  while((exec = regex.exec(text)) !== null) {
    const first = exec.index,
          match = exec[0]
    plainMap.push([first, match, 'plain'])
  }
  return plainMap
}
export const isolateAt = async text => {
  const regex = /@\w{1,31}/g,
        atMap = []
  let exec
  while((exec = regex.exec(text)) !== null) {
    const first = exec.index,
          match = exec[0]
    atMap.push([first, match, 'at'])
  }
  return atMap
}
export const isolateHash = async text => {
  const regex = /#\w+/g,
        hashMap = []
  let exec
  while((exec = regex.exec(text)) !== null) {
    const first = exec.index,
          match = exec[0]
    hashMap.push([first, match, 'hash'])
  }
  return hashMap
}
