# UnsafeMaths: a gas-optimised arithmetic library for Ethereum

This is OpenZepplin's
[SafeMath.sol](https://github.com/ConsenSys/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol),
rewritten in Aztec Protocol's [Huff](https://github.com/AztecProtocol/huff/)
domain-specific language for the Ethereum Virtual Machine.

The goal of using Huff to rewrite SafeMath is not to replace it, but for purely
educational purposes. The code has simple tests which check for the same
arithmetic overflows which SafeMath does, but has neither been audited nor
formally verified. As its name suggests, **don't use this in production**!

## Gas savings

| Operation | SafeMath gas cost | UnsafeMaths gas cost | Savings | Notes |
|-|-|-|-|-|
| `add(a, b)` | 3323 | 3159 | 164 |  |
| `sub(a, b)` | 3397 | 3222 | 175 |  |
| `mul(a, b)` | 3496 | 3306 | 190 |  |
| `mul(a, b)` | 3435 | 3252 | 183 | `a == 0`, so both contracts return 0 immediately |
| `div(a, b)` | 3384 | 3246 | 138 |  |

Note that the above gas costs exclude the base gas cost of 21000, and include
overhead which comes from using a wrapper contract to call an external
function. Furthermore, the SafeMath contract was compiled with the `--optimize`
flag. If we use `ethereumjs-vm` to run each function, however,
their gas consumption is as follows:

| Operation | UnsafeMath gas cost | Notes |
|-|-|-|
| `add(a, b)` | 117 |  |
| `sub(a, b)` | 136 |  |
| `mul(a, b)` | 198 |  |
| `mul(a, b)` | 156 | `a == 0` |
| `div(a, b)` | 182 |  |

## Getting started

First, clone this repository and install dependencies:

```bash
git clone git@github.com:weijiekoh/UnsafeMaths.git &&
cd UnsafeMaths &&
npm i
```

Next, compile the contracts. You need `solc` v0.6x either in your `$PATH` or
somewhere on your disk. 

```bash
SOLC=/path/to/solc/ ./scripts/compileSol.sh
```

Test the Huff code as such:

```bash
npm run test
```

To benchmark the gas consumption of UnsafeMaths versus OpenZepplin's SafeMath,
first run Ganache:


```bash
npm run ganache-cli
```

Next, run the following in a different terminal:

```
npm run test-gasBenchmarks
```
