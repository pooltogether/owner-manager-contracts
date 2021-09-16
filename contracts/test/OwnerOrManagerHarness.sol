// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "../OwnerOrManager.sol";

contract OwnerOrManagerHarness is OwnerOrManager {
    event ReallyCoolEvent(address);

    constructor() OwnerOrManager() {}

    function protectedFunction() external onlyManagerOrOwner {
        // do admin priviledges things

        emit ReallyCoolEvent(msg.sender);
    }
}
