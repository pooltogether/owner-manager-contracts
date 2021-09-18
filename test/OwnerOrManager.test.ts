import { expect } from 'chai';
import { Contract, ContractFactory, Signer, Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const { constants } = ethers;
const { AddressZero } = constants;

describe('OwnerOrManager', () => {
    let ownerOrManager: Contract;

    let contractsOwner: SignerWithAddress,
        wallet2: SignerWithAddress,
        wallet3: SignerWithAddress,
        wallet4: SignerWithAddress;

    beforeEach(async () => {
        [contractsOwner, wallet2, wallet3, wallet4] = await ethers.getSigners();

        const ownerOrManagerFactory = await ethers.getContractFactory('OwnerOrManagerHarness');

        ownerOrManager = await ownerOrManagerFactory.deploy();
    });

    describe('owner()', () => {
        it('should be deployer address by default', async () => {
            expect(await ownerOrManager.owner()).to.equal(contractsOwner.address);
        });
    });

    describe('manager()', () => {
        it('should be address zero by default', async () => {
            expect(await ownerOrManager.manager()).to.equal(AddressZero);
        });
    });

    describe('pendingOwner()', () => {
        it('should be address zero by default', async () => {
            expect(await ownerOrManager.pendingOwner()).to.equal(AddressZero);
        });
    });

    describe('transferOwnership()', () => {
        it('should transfer ownership to wallet2', async () => {
            expect(await ownerOrManager.transferOwnership(wallet2.address));
            expect(await ownerOrManager.pendingOwner()).to.equal(wallet2.address);
        });

        it('should fail to transfer ownership to address zero', async () => {
            await expect(ownerOrManager.transferOwnership(AddressZero)).to.be.revertedWith(
                'OwnerOrManager/pendingOwner-not-zero-address',
            );
        });

        it('should fail to transfer ownership if not currently owner', async () => {
            await expect(
                ownerOrManager.connect(wallet2).transferOwnership(wallet3.address),
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe('claimOwnership()', () => {
        beforeEach(async () => {
            await ownerOrManager.transferOwnership(wallet2.address);
        });

        it('should be claimed by pending owner', async () => {
            expect(await ownerOrManager.connect(wallet2).claimOwnership())
                .to.emit(ownerOrManager, 'OwnershipTransferred')
                .withArgs(contractsOwner.address, wallet2.address);

            expect(await ownerOrManager.owner()).to.equal(wallet2.address);
            expect(await ownerOrManager.pendingOwner()).to.equal(AddressZero);
        });

        it('should fail to claim ownership if not pending owner', async () => {
            await expect(ownerOrManager.connect(wallet3).claimOwnership()).to.be.revertedWith(
                'OwnerOrManager/caller-not-pendingOwner',
            );
        });
    });

    describe('setManager()', () => {
        it('should set manager', async () => {
            expect(await ownerOrManager.setManager(wallet2.address))
                .to.emit(ownerOrManager, 'ManagerTransferred')
                .withArgs(wallet2.address);

            expect(await ownerOrManager.manager()).to.equal(wallet2.address);
        });

        it('should set manager to address zero', async () => {
            await ownerOrManager.setManager(wallet2.address);

            expect(await ownerOrManager.setManager(AddressZero))
                .to.emit(ownerOrManager, 'ManagerTransferred')
                .withArgs(AddressZero);

            expect(await ownerOrManager.manager()).to.equal(AddressZero);
        });

        it('should fail to set manager if already manager', async () => {
            await ownerOrManager.setManager(wallet2.address);

            await expect(ownerOrManager.setManager(wallet2.address)).to.be.revertedWith(
                'OwnerOrManager/existing-manager-address',
            );
        });
    });

    describe('onlyManagerOrOwner()', () => {
        it('should fail to call permissioned function if not owner or manager', async () => {
            await expect(ownerOrManager.connect(wallet3).protectedFunction()).to.be.revertedWith(
                'Manager/caller-not-manager-or-owner',
            );
        });

        it('should call permissioned function if owner or manager', async () => {
            await expect(ownerOrManager.protectedFunction()).to.emit(
                ownerOrManager,
                'ReallyCoolEvent',
            );

            await ownerOrManager.setManager(wallet2.address);
            await expect(ownerOrManager.connect(wallet2).protectedFunction()).to.emit(
                ownerOrManager,
                'ReallyCoolEvent',
            );
        });
    });
});
