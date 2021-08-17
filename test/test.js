import { tokens, ether, ETHER_ADDRESS, EVM_REVERT, wait } from './helpers'

var ME = artifacts.require("./ME.sol");
var Timeline = artifacts.require("./Timeline.sol");
var UME = artifacts.require("./UME.sol");
var We = artifacts.require("./We.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Timeline', ([deployer, user]) => {
  let we, meToken, umeToken

  beforeEach(async () => {
  })

  describe('testing We contract...', () => {
    describe('success', () => {
    })

    describe('failure', () => {
    })
  })

  describe('testing cache/calculate/clear/redeem...', () => {
    describe('success', () => {
      beforeEach(async () => {
      })
    })

    describe('failure', () => {
    })
  })

  describe('testing newMeme...', () => {

    describe('success', () => {
      beforeEach(async () => {
      })
    })

    describe('failure', () => {
    })
  })

  describe('testing ME token...', () => {

    describe('success', () => {
      beforeEach(async () => {
      })
    })

    describe('failure', () => {
    })
  })

  describe('testing ...', () => {
  })
}
