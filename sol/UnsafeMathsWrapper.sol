pragma solidity ^0.6.0;
//SPDX-License-Identifier: NA

interface UnsafeMaths {
    function add(uint256 a, uint256 b) external pure returns (uint256);
    function sub(uint256 a, uint256 b) external pure returns (uint256);
    function mul(uint256 a, uint256 b) external pure returns (uint256);
    function div(uint256 a, uint256 b) external pure returns (uint256);
}

contract UnsafeMathsWrapper {
    UnsafeMaths internal unsafeMaths;

    constructor(UnsafeMaths _unsafeMaths) public {
        unsafeMaths = _unsafeMaths;
    }

    function add(uint256 a, uint256 b) public returns (uint256) {
        return unsafeMaths.add(a, b);
    }

    function sub(uint256 a, uint256 b) public returns (uint256) {
        return unsafeMaths.sub(a, b);
    }

    function mul(uint256 a, uint256 b) public returns (uint256) {
        return unsafeMaths.mul(a, b);
    }

    function div(uint256 a, uint256 b) public returns (uint256) {
        return unsafeMaths.div(a, b);
    }
}
