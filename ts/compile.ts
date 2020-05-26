import * as fs from 'fs'
import * as path from 'path'
import * as ethers from 'ethers'
const { parser } = require('@aztec/huff')
const { Runtime, getNewVM } = require('@aztec/huff').Runtime

const filename = 'UnsafeMaths.huff'
const binFilename = 'UnsafeMaths.bin'
const mainMacro = 'UnsafeMaths__MAIN'
const binFilepath = path.join(__dirname, '../abi', binFilename)

const compile = () => {
    const main = new Runtime('../huff/' + filename, __dirname)
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
    const bytecode = constructorMacro.data.bytecode + c.data.bytecode

    return bytecode
}

if (require.main === module) {
    const bytecode = compile()
    fs.writeFileSync(binFilepath, bytecode.toString())
    
}

export { compile }
