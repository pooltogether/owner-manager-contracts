// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.6.0 <= 0.8.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/**
*  @title Abstract ownable contract with additional manager role
 * @notice Contract module based on Ownable which provides a basic access control mechanism, where
 * there is an account (a draw manager for example) that can be granted exclusive access to
 * specific functions.
 *
 * The manager account needs to be set using {setManager}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyManager`, which can be applied to your functions to restrict their use to
 * the manager.
 */
abstract contract OwnerOrManager is ContextUpgradeable, OwnableUpgradeable {

    address private _manager;

    /**
     * @dev Emitted when _manager has been changed.
     * @param newManager new _manager address.
     */
    event ManagerTransferred(address indexed newManager);

    /**
     * @notice Gets current _manager.
     * @dev Returns current _manager address.1
     * @return Current _manager address.
     */
    function manager() public view virtual returns (address) {
        return _manager;
    }

    /**
     * @dev Throws if called by any account other than the manager.
     */
    modifier onlyManagerOrOwner() {
        require(manager() == _msgSender() || owner() == _msgSender(), "Manager/caller-not-manager-or-owner");
        _;
    }

    /**
     * @notice Set or change of manager.
     * @dev Throws if called by any account other than the owner.
     * @param _newManager New _manager address.
     * @return Boolean to indicate if the operation was successful or not.
     */
    function setManager(address _newManager) public onlyOwner returns (bool) {
        _setManager(_newManager);
    }

    /**
     * @notice Set or change of manager.
     * @dev Throws if called by any account other than the owner.
     * @param _newManager New _manager address.
     * @return Boolean to indicate if the operation was successful or not.
     */
    function _setManager(address _newManager) internal returns (bool) {
        address _previousManager = _manager;
        require(_newManager != address(0), "Manager/manager-not-zero-address");
        require(_newManager != _previousManager, "Manager/existing-manager-address");

        _manager = _newManager;

        emit ManagerTransferred(_newManager);
        return true;
    }
}