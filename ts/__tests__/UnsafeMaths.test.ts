import * as fs from 'fs'
import * as ethers from 'ethers'
const { parser } = require('@aztec/huff')
const { Runtime, getNewVM } = require('@aztec/huff').Runtime

const PRIVKEY = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'

const abi = JSON.parse(fs.readFileSync('./abi/SafeMath.abi').toString())

const filename = 'UnsafeMaths.huff'
const mainMacro = 'UnsafeMaths__MAIN'

const printStack = (data: any) => {
    if (data.stack && data.stack.length) {
        for (let s of data.stack) {
            console.log(s.words.map((x) => x.toString(16)))
        }
    }
}

describe('UnsafeMaths', () => {
    let main
    let vm

    beforeAll(() => {
        main = new Runtime('../../huff/' + filename, __dirname)
        vm = getNewVM()

    })

    describe('add', () => {
        it('should work for valid inputs', async () => {
            const a = BigInt(1)
            const b = BigInt(2)

            const callData = [
                { index: 0, value: 0x771602f7, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]
            const data = await main(vm, mainMacro, [], [], callData, 0, 0)
            const returnValue = BigInt('0x' + data.returnValue.toString('hex'))

            console.log('Return value:', returnValue)

            expect(returnValue).toEqual(a + b)
            console.log('Gas used for add():', data.gas)
            //console.log('returnValue:', data.returnValue)
        })

        it('should revert instead of overflowing', async () => {
            const a = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            const b = BigInt(2)
            const callData = [
                { index: 0, value: 0x771602f7, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]

            expect.assertions(1)
            try {
                await main(vm, 'UnsafeMaths__MAIN', [], [], callData, 0, 0)
            } catch {
                expect(true).toBeTruthy()
            }
        })
    })

    describe('sub', () => {
        it('should work for valid inputs', async () => {
            const a = BigInt(320)
            const b = BigInt(13)

            const callData = [
                { index: 0, value: 0xb67d77c5, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]
            const data = await main(vm, mainMacro, [], [], callData, 0, 0)
            const returnValue = BigInt('0x' + data.returnValue.toString('hex'))

            expect(returnValue).toEqual(a - b)

            console.log('Return value:', returnValue)
            console.log('Gas used for sub():', data.gas)

        })

        it('should revert instead of overflowing', async () => {
            const a = BigInt(2)
            const b = BigInt(3)
            const callData = [
                { index: 0, value: 0xb67d77c5, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]

            expect.assertions(1)
            try {
                await main(vm, 'UnsafeMaths__MAIN', [], [], callData, 0, 0)
            } catch {
                expect(true).toBeTruthy()
            }
        })
    })

    describe('mul', () => {
        it('should work for valid inputs', async () => {
            const a = BigInt(2)
            const b = BigInt(3)

            const callData = [
                { index: 0, value: 0xc8a4ac9c, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]
            const data = await main(vm, mainMacro, [], [], callData, 0, 0)
            const returnValue = BigInt('0x' + data.returnValue.toString('hex'))

            console.log('Return value:', returnValue)
            console.log('Gas used for mul():', data.gas)

            expect(returnValue).toEqual(a * b)
        })

        it('should work when a == 0', async () => {
            const a = BigInt(0)
            const b = BigInt(3)

            const callData = [
                { index: 0, value: 0xc8a4ac9c, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]
            const data = await main(vm, mainMacro, [], [], callData, 0, 0)
            const returnValue = BigInt('0x' + data.returnValue.toString('hex'))

            console.log('Return value:', returnValue)
            console.log('Gas used for mul() when a == 0:', data.gas)

            expect(returnValue).toEqual(a * b)
        })

        it('should work when b == 0', async () => {
            const a = BigInt(3)
            const b = BigInt(0)

            const callData = [
                { index: 0, value: 0xc8a4ac9c, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]
            const data = await main(vm, mainMacro, [], [], callData, 0, 0)
            const returnValue = BigInt('0x' + data.returnValue.toString('hex'))

            console.log('Return value:', returnValue)
            console.log('Gas used for mul():', data.gas)

            expect(returnValue).toEqual(a * b)
        })

        it('should revert instead of overflowing', async () => {
            const a = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0')
            const b = BigInt(2)
            const callData = [
                { index: 0, value: 0xc8a4ac9c, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]

            expect.assertions(1)
            try {
                await main(vm, 'UnsafeMaths__MAIN', [], [], callData, 0, 0)
            } catch {
                expect(true).toBeTruthy()
            }
        })
    })

    describe('div', () => {
        it('should work for valid inputs', async () => {
            const a = BigInt(6)
            const b = BigInt(3)

            const callData = [
                { index: 0, value: 0xa391c15b, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]
            const data = await main(vm, mainMacro, [], [], callData, 0, 0)
            const returnValue = BigInt('0x' + data.returnValue.toString('hex'))

            console.log('Return value:', returnValue)
            console.log('Gas used for div():', data.gas)

            expect(returnValue).toEqual(a / b)
        })

        it('should revert instead of division by 0', async () => {
            const a = BigInt(5)
            const b = BigInt(0)
            const callData = [
                { index: 0, value: 0xa391c15b, len: 4 },
                { index: 4, value: a, len: 32 },
                { index: 36, value: b, len: 32 },
            ]

            expect.assertions(1)
            try {
                await main(vm, 'UnsafeMaths__MAIN', [], [], callData, 0, 0)
            } catch {
                expect(true).toBeTruthy()
            }
        })
    })

})
