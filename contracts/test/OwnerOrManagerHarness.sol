// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "../OwnerOrManager.sol";
import "hardhat/console.sol";


contract OwnerOrManagerHarness is OwnerOrManager {

    constructor() public {
        __Ownable_init();
        
    }


    function protectedFunction() public onlyManagerOrOwner {
        
        // do admin priviledges things
    }

}