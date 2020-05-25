import * as fs from 'fs'
import * as ethers from 'ethers'
const { parser } = require('@aztec/huff')
const { Runtime, getNewVM } = require('@aztec/huff').Runtime

const PRIVKEY = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'

const BASE_GAS = 21000
const abi = JSON.parse(fs.readFileSync('./abi/SafeMath.abi').toString())
const usmWrapperAbi = JSON.parse(fs.readFileSync('./abi/UnsafeMathsWrapper.abi').toString())
const smWrapperAbi = JSON.parse(fs.readFileSync('./abi/SafeMathsWrapper.abi').toString())

const filename = 'UnsafeMaths.huff'
const mainMacro = 'UnsafeMaths__MAIN'

describe('UnsafeMaths', () => {
    let main
    let vm
    let provider
    let smContract
    let smWrapperContract
    let usmContract
    let usmWrapperContract

    beforeAll(async () => {
        main = new Runtime('../../huff/' + filename, __dirname)
        vm = getNewVM()
        const { inputMap, macros, jumptables } = parser.parseFile(filename, './huff/')
        const c = parser.processMacro(mainMacro, 0, [], macros, inputMap, jumptables)

        const parsedConstructor = parser.parseFile(filename, './huff/')
        const constructorMacro = parser.processMacro(
            'MAIN__CONSTRUCTOR',
            0,
            [],
            parsedConstructor.macros,
            parsedConstructor.inputMap,
            parsedConstructor.jumptables,
        )

        // Deploy bytecode
        provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
        const wallet = new ethers.Wallet(
            PRIVKEY,
            provider,
        )

        const smBytecode = fs.readFileSync('./abi/SafeMath.bin').toString()
        const smFactory = new ethers.ContractFactory(
            abi,
            smBytecode,
            wallet,
        )

        smContract = await smFactory.deploy()
        console.log('SafeMaths deployed at:', smContract.address)

        const smWrapperBytecode = fs.readFileSync('./abi/SafeMathsWrapper.bin').toString()
        const smWrapperFactory = new ethers.ContractFactory(
            smWrapperAbi,
            smWrapperBytecode,
            wallet
        )

        smWrapperContract = await smWrapperFactory.deploy(smContract.address, {})
        console.log('SafeMathsWrapper deployed at:', smWrapperContract.address)

        const usmFactory = new ethers.ContractFactory(
            abi,
            constructorMacro.data.bytecode + c.data.bytecode,
            wallet,
        )
        usmContract = await usmFactory.deploy()

        console.log('UnsafeMaths deployed at:', usmContract.address)

        const wrapperBytecode = fs.readFileSync('./abi/UnsafeMathsWrapper.bin').toString()
        const wrapperFactory = new ethers.ContractFactory(
            smWrapperAbi,
            wrapperBytecode,
            wallet,
        )
        usmWrapperContract = await wrapperFactory.deploy(usmContract.address, {})

        console.log('UnsafeMaths wrapper deployed at:', usmWrapperContract.address)
    })

    describe('add', () => {
        it('should work for valid inputs', async () => {
            const a = 1
            const b = 2
            const usmTx = await usmWrapperContract.add(a, b)
            const usmReceipt = await usmTx.wait()

            const smTx = await smWrapperContract.add(a, b)
            const smReceipt = await smTx.wait()
            console.log(
                'SafeMaths.add() minus base gas cost:',
                smReceipt.gasUsed - BASE_GAS, 'gas',
                '\nUnsafeMathsWrapper.add() minus base gas cost:', 
                usmReceipt.gasUsed - BASE_GAS, 'gas',
                '\nGas savings:', (smReceipt.gasUsed - usmReceipt.gasUsed).toString(), 'gas',
            )
        })
    })

    describe('sub', () => {
        it('should work for valid inputs', async () => {
            const a = 2
            const b = 1
            const usmTx = await usmWrapperContract.sub(a, b)
            const usmReceipt = await usmTx.wait()

            const smTx = await smWrapperContract.sub(a, b)
            const smReceipt = await smTx.wait()
            console.log(
                'SafeMaths.sub() minus base gas cost:',
                smReceipt.gasUsed - BASE_GAS, 'gas',
                '\nUnsafeMathsWrapper.sub() minus base gas cost:', 
                usmReceipt.gasUsed - BASE_GAS, 'gas',
                '\nGas savings:', (smReceipt.gasUsed - usmReceipt.gasUsed).toString(), 'gas',
            )
        })
    })

    describe('mul', () => {
        let regularGas
        it('should work for valid inputs', async () => {
            const a = 2
            const b = 1
            const usmTx = await usmWrapperContract.mul(a, b)
            const usmReceipt = await usmTx.wait()
            regularGas = usmReceipt.gasUsed

            const smTx = await smWrapperContract.mul(a, b)
            const smReceipt = await smTx.wait()
            console.log(
                'SafeMaths.mul() minus base gas cost:',
                smReceipt.gasUsed - BASE_GAS, 'gas',
                '\nUnsafeMathsWrapper.mul() minus base gas cost:', 
                usmReceipt.gasUsed - BASE_GAS, 'gas',
                '\nGas savings:', (smReceipt.gasUsed - usmReceipt.gasUsed).toString(), 'gas',
            )
        })

        it('should use even less gas if a == 0', async () => {
            const a = 0
            const b = 1
            const usmTx = await usmWrapperContract.mul(a, b)
            const usmReceipt = await usmTx.wait()
            expect(usmReceipt.gasUsed < regularGas).toBeTruthy()

            const smTx = await smWrapperContract.mul(a, b)
            const smReceipt = await smTx.wait()
            console.log(
                'When a == 0:',
                '\nSafeMaths.mul() minus base gas cost:',
                smReceipt.gasUsed - BASE_GAS, 'gas',
                '\nUnsafeMathsWrapper.mul() minus base gas cost:', 
                usmReceipt.gasUsed - BASE_GAS, 'gas',
                '\nGas savings:', (smReceipt.gasUsed - usmReceipt.gasUsed).toString(), 'gas',
            )
        })
    })

    describe('div', () => {
        let regularGas
        it('should work for valid inputs', async () => {
            const a = 6
            const b = 3
            const usmTx = await usmWrapperContract.div(a, b)
            const usmReceipt = await usmTx.wait()
            regularGas = usmReceipt.gasUsed

            const smTx = await smWrapperContract.div(a, b)
            const smReceipt = await smTx.wait()
            console.log(
                'SafeMaths.div() minus base gas cost:',
                smReceipt.gasUsed - BASE_GAS, 'gas',
                '\nUnsafeMathsWrapper.div() minus base gas cost:', 
                usmReceipt.gasUsed - BASE_GAS, 'gas',
                '\nGas savings:', (smReceipt.gasUsed - usmReceipt.gasUsed).toString(), 'gas',
            )
        })

        it('should revert if b == 0', async () => {
            expect.assertions(1)
            const a = 5
            const b = 0

            try {
                await usmWrapperContract.div(a, b)
            } catch {
                expect(true).toBeTruthy()
            }
        })
    })

    describe('mod', () => {
        let regularGas
        it('should work for valid inputs', async () => {
            const a = 6
            const b = 3
            const usmTx = await usmWrapperContract.mod(a, b)
            const usmReceipt = await usmTx.wait()
            regularGas = usmReceipt.gasUsed

            const smTx = await smWrapperContract.mod(a, b)
            const smReceipt = await smTx.wait()
            console.log(
                'SafeMaths.mod() minus base gas cost:',
                smReceipt.gasUsed - BASE_GAS, 'gas',
                '\nUnsafeMathsWrapper.mod() minus base gas cost:', 
                usmReceipt.gasUsed - BASE_GAS, 'gas',
                '\nGas savings:', (smReceipt.gasUsed - usmReceipt.gasUsed).toString(), 'gas',
            )
        })

        it('should revert if b == 0', async () => {
            expect.assertions(1)
            const a = 5
            const b = 0

            try {
                await usmWrapperContract.mod(a, b)
            } catch {
                expect(true).toBeTruthy()
            }
        })
    })
})
