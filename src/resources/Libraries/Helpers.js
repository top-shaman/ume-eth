export const toBytes = async (s) => {
  return await window.web3.utils.fromAscii(s)
}
export const fromBytes = async (b) => {
  return await window.web3.utils.toUtf8(b)
}
export const is32Bytes = h => {
  let re = /0x[0-9A-Fa-f]{64}/g
  return re.test(h)
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
export const isolatePlainNew = async text => {
  const regex = /([@]\w{1,31})|([#]\w+)/g,
        split = text.split(regex).filter(elem => !regex.test(elem) && elem ),
        plainMap = [],
        indices = []
  let exec, count = 0
  if(!regex.test(text)) {
    indices.push(0)
    plainMap.push([0, text, 'plain'])
  }
  while((exec = regex.exec(text)) !== null) {
    if(indices.length===0 && exec.index!==0) {
      indices.push(0)
      plainMap.push([indices[0], split[0], 'plain'])
      count++
    }
    const next = exec.index + exec[0].length
    if(next!==text.length) {
      indices.push(next)
      plainMap.push(indices[count], split[count], 'plain')
      count++
    }
  }
  console.log(text)
  console.log(indices)
  return split
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
