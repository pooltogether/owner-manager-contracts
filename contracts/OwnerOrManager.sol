// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./external/openzeppelin/Ownable.sol";

/**
*  @title Abstract ownable contract with additional manager role
 * @notice Contract module based on Ownable which provides a basic access control mechanism, where
 * there is an owner and a manager that can be granted exclusive access to specific functions.
 *
 * By default, the owner is the deployer of the contract.
 *
 * The owner account is set through a two steps process.
 *      1. The current `owner` calls {transferOwnership} to set a `pendingOwner`
 *      2. The `pendingOwner` calls {acceptOwnership} to accept the ownership transfer
 *
 * The manager account needs to be set using {setManager}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyManager`, which can be applied to your functions to restrict their use to
 * the manager.
 *
 *
 */
abstract contract OwnerOrManager is Ownable {

    address private _manager;
    address private _pendingOwner;

    /**
     * @dev Emitted when `_manager` has been changed.
     * @param newManager new `_manager` address.
     */
    event ManagerTransferred(address indexed newManager);

    /**
     * @notice Gets current `_manager`.
     * @return Current `_manager` address.
     */
    function manager() public view virtual returns (address) {
        return _manager;
    }

    /**
     * @notice Gets current `_pendingOwner`.
     * @return Current `_pendingOwner` address.
     */
    function pendingOwner() external view virtual returns (address) {
        return _pendingOwner;
    }

    /**
    * @dev Throws if called by any account other than the `pendingOwner`.
    */
    modifier onlyPendingOwner() {
        require(_msgSender() == _pendingOwner, "OwnerOrManager/caller-not-pendingOwner");
        _;
    }

    /**
     * @dev Throws if called by any account other than the manager.
     */
    modifier onlyManagerOrOwner() {
        require(manager() == _msgSender() || owner() == _msgSender(), "OwnerOrManager/caller-not-manager-or-owner");
        _;
    }

    /**
    * @dev Allows current owner to set the pendingOwner address.
    * @param _newOwner Address to transfer ownership to.
    */
    function transferOwnership(address _newOwner) public override onlyOwner {
        require(_newOwner != address(0), "OwnerOrManager/pendingOwner-not-zero-address");
        _pendingOwner = _newOwner;
    }

    /**
    * @dev Allows the pendingOwner address to finalize the transfer.
    */
    function claimOwnership() external onlyPendingOwner {
        _setOwner(_pendingOwner);
        _pendingOwner = address(0);
    }

    /**
     * @notice Set or change of manager.
     * @dev Throws if called by any account other than the owner.
     * @param _newManager New _manager address.
     * @return Boolean to indicate if the operation was successful or not.
     */
    function setManager(address _newManager) external onlyOwner returns (bool) {
        return _setManager(_newManager);
    }

    /**
     * @notice Set or change of manager.
     * @param _newManager New _manager address.
     * @return Boolean to indicate if the operation was successful or not.
     */
    function _setManager(address _newManager) internal returns (bool) {
        address _previousManager = _manager;

        require(_newManager != address(0), "OwnerOrManager/manager-not-zero-address");
        require(_newManager != _previousManager, "OwnerOrManager/existing-manager-address");

        _manager = _newManager;

        emit ManagerTransferred(_newManager);
        return true;
    }
}
