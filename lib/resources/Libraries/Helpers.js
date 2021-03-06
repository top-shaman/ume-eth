"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBytes = exports.isolatePlain = exports.isolateHash = exports.isolateAt = exports.is32Bytes = exports.fromBytes = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

const toBytes = async s => {
  return await window.web3.utils.fromAscii(s);
};

exports.toBytes = toBytes;

const fromBytes = async b => {
  return await window.web3.utils.toUtf8(b);
};

exports.fromBytes = fromBytes;

const is32Bytes = h => {
  let re = /0x[0-9A-Fa-f]{64}/g;
  return re.test(h);
};

exports.is32Bytes = is32Bytes;

const isolatePlain = async text => {
  const regex = /((([^@#](?=\w)*)|([@#](?!\w))))(?<!(([@]\w{1,31})|([#]\w+)))([^@#]|([@#](?!\w)))*/g,
        plainMap = [];
  let exec;

  while ((exec = regex.exec(text)) !== null) {
    const first = exec.index,
          match = exec[0];
    plainMap.push([first, match, 'plain']);
  }

  return plainMap;
};

exports.isolatePlain = isolatePlain;

const isolateAt = async text => {
  const regex = /@\w{1,31}/g,
        atMap = [];
  let exec;

  while ((exec = regex.exec(text)) !== null) {
    const first = exec.index,
          match = exec[0];
    atMap.push([first, match, 'at']);
  }

  return atMap;
};

exports.isolateAt = isolateAt;

const isolateHash = async text => {
  const regex = /#\w+/g,
        hashMap = [];
  let exec;

  while ((exec = regex.exec(text)) !== null) {
    const first = exec.index,
          match = exec[0];
    hashMap.push([first, match, 'hash']);
  }

  return hashMap;
};

exports.isolateHash = isolateHash;