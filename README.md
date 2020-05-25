# UnsafeMaths: a gas-optimised arithmetic library for Ethereum

This is OpenZepplin's
[SafeMath.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol),
rewritten in Aztec Protocol's [Huff](https://github.com/AztecProtocol/huff/)
domain-specific language for the Ethereum Virtual Machine.

The goal of using Huff to rewrite SafeMath is not to replace it, but for purely
educational purposes. The code has simple tests which check for the same
arithmetic overflows which SafeMath does, but has neither been audited nor
formally verified. As its name suggests, **don't use this in production**!

## Gas savings

If we use Remix and `ethereumjs-vm` to run each function, their reported
execution gas cost is as follows:

| Operation | SafeMath gas cost | UnsafeMaths gas cost | Savings | Notes |
|-|-|-|-|-|
| `add(a, b)` | 281 | 117 | 164 | |
| `sub(a, b)` | 311 | 136 | 175 | |
| `mul(a, b)` | 388 | 198 | 190 | |
| `mul(a, b)` | 339 | 156 | 183 | `a == 0` |
| `div(a, b)` | 320 | 182 | 138 | |
| `mod(a, b)` | 446 | 201 | 245 | |

I also benchmarked each SafeMath and UnsafeMath function using Ganache, and
found the same gas savings per function, except for `mod()`:

| Operation | SafeMath gas cost | UnsafeMaths gas cost | Savings | Notes |
|-|-|-|-|-|
| `add(a, b)` | 3323 | 3159 | 164 | |
| `sub(a, b)` | 3397 | 3222 | 175 | |
| `mul(a, b)` | 3496 | 3306 | 190 | |
| `mul(a, b)` | 3435 | 3252 | 183 | `a == 0`, so both contracts return 0 immediately |
| `div(a, b)` | 3384 | 3246 | 138 | |
| `mod(a, b)` | 3505 | 3334 | 171 | |

Note that the above gas costs exclude the base gas cost of 21000, and include
overhead which comes from using a wrapper contract to call an external
function.

In both benchmarks, the SafeMath contract was compiled with optimisation enabled.

## Getting started

First, clone this repository, install dependencies, and build the source code:

```bash
git clone git@github.com:weijiekoh/UnsafeMaths.git &&
cd UnsafeMaths &&
npm i &&
npm run build
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
