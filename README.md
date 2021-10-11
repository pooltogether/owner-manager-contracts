# PoolTogether Owner Manager Contracts
![Tests](https://github.com/pooltogether/owner-manager-contracts/actions/workflows/main.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/pooltogether/owner-manager-contracts/badge.svg?branch=master)](https://coveralls.io/github/pooltogether/owner-manager-contracts?branch=master)

Abstract ownable and manageable contracts that can be inherited by other contracts to provide a basic access control mechanism, where
there is an owner and a manager that can be granted exclusive access to specific functions.

The `owner` is first set by passing the address of the `initialOwner` to the Ownable constructor.
 
The owner account can be transferred through a two steps process:
1. The current `owner` calls `transferOwnership` to set a `pendingOwner`
2. The `pendingOwner` calls `acceptOwnership` to accept the ownership transfer

The manager account needs to be set using `setManager`.

This module is used through inheritance. It will make available the modifiers `onlyManager`, `onlyOwner` and `onlyManagerOrOwner`, which can be applied to your functions to restrict their use to the manager and/or the owner.

## Usage
This repo is setup to compile (`nvm use && yarn compile`) and successfully pass tests (`yarn test`)


# Installation
Install the repo and dependencies by running:
`yarn`

## Deployment
These contracts can be deployed to a network by running:
`yarn deploy <networkName>`

## Verification
These contracts can be verified on Etherscan, or an Etherscan clone, for example (Polygonscan) by running:
`yarn etherscan-verify <ethereum network name>` or `yarn etherscan-verify-polygon matic`


# Testing
Run the unit tests locally with:
`yarn test`

## Coverage
Generate the test coverage report with:
`yarn coverage`
