pragma solidity ^0.6.0;
//SPDX-License-Identifier: NA

interface SafeMaths {
    function add(uint256 a, uint256 b) external pure returns (uint256);
    function sub(uint256 a, uint256 b) external pure returns (uint256);
    function mul(uint256 a, uint256 b) external pure returns (uint256);
    function div(uint256 a, uint256 b) external pure returns (uint256);
}

contract SafeMathsWrapper {
    SafeMaths internal safeMaths;

    constructor(SafeMaths _safeMaths) public {
        safeMaths = _safeMaths;
    }

    function add(uint256 a, uint256 b) public returns (uint256) {
        return safeMaths.add(a, b);
    }

    function sub(uint256 a, uint256 b) public returns (uint256) {
        return safeMaths.sub(a, b);
    }

    function mul(uint256 a, uint256 b) public returns (uint256) {
        return safeMaths.mul(a, b);
    }

    function div(uint256 a, uint256 b) public returns (uint256) {
        return safeMaths.div(a, b);
    }
}

