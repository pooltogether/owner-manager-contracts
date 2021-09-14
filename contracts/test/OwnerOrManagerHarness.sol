// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.6.0 <= 0.8.6;

import "../OwnerOrManager.sol";
import "hardhat/console.sol";


contract OwnerOrManagerHarness is OwnerOrManager {

    event ReallyCoolEvent(address);

    constructor() OwnerOrManager(){
        
        
    }


    function protectedFunction() public onlyManagerOrOwner {
        
        // do admin priviledges things


        emit ReallyCoolEvent(msg.sender);
    }

}