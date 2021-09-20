import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const { constants } = ethers;
const { AddressZero } = constants;

describe('Ownable', () => {
    let ownable: Contract;

    let contractsOwner: SignerWithAddress,
        wallet2: SignerWithAddress,
        wallet3: SignerWithAddress,
        wallet4: SignerWithAddress;

    beforeEach(async () => {
        [contractsOwner, wallet2, wallet3, wallet4] = await ethers.getSigners();

        const ownableFactory = await ethers.getContractFactory('OwnableHarness');

        ownable = await ownableFactory.deploy(contractsOwner.address);
    });

    describe('owner()', () => {
        it('should be deployer address by default', async () => {
            expect(await ownable.owner()).to.equal(contractsOwner.address);
        });
    });

    describe('pendingOwner()', () => {
        it('should be address zero by default', async () => {
            expect(await ownable.pendingOwner()).to.equal(AddressZero);
        });
    });

    describe('transferOwnership()', () => {
        it('should transfer ownership to wallet2', async () => {
            await expect(ownable.transferOwnership(wallet2.address))
                .to.emit(ownable, 'OwnershipOffered')
                .withArgs(wallet2.address);

            expect(await ownable.pendingOwner()).to.equal(wallet2.address);
        });

        it('should fail to transfer ownership to address zero', async () => {
            await expect(ownable.transferOwnership(AddressZero)).to.be.revertedWith(
                'Ownable/pendingOwner-not-zero-address',
            );
        });

        it('should fail to transfer ownership if not currently owner', async () => {
            await expect(
                ownable.connect(wallet2).transferOwnership(wallet3.address),
            ).to.be.revertedWith('Ownable/caller-not-owner');
        });
    });

    describe('claimOwnership()', () => {
        beforeEach(async () => {
            await ownable.transferOwnership(wallet2.address);
        });

        it('should be claimed by pending owner', async () => {
            expect(await ownable.connect(wallet2).claimOwnership())
                .to.emit(ownable, 'OwnershipTransferred')
                .withArgs(contractsOwner.address, wallet2.address);

            expect(await ownable.owner()).to.equal(wallet2.address);
            expect(await ownable.pendingOwner()).to.equal(AddressZero);
        });

        it('should fail to claim ownership if not pending owner', async () => {
            await expect(ownable.connect(wallet3).claimOwnership()).to.be.revertedWith(
                'Ownable/caller-not-pendingOwner',
            );
        });
    });

    describe('renounceOwnership()', () => {
        beforeEach(async () => {
            await ownable.transferOwnership(wallet2.address);
            await ownable.connect(wallet2).claimOwnership();
        });

        it('should succeed to renounce ownership if owner', async () => {
            expect(await ownable.connect(wallet2).renounceOwnership())
                .to.emit(ownable, 'OwnershipTransferred')
                .withArgs(wallet2.address, AddressZero);

            expect(await ownable.owner()).to.equal(AddressZero);
            expect(await ownable.pendingOwner()).to.equal(AddressZero);
        });

        it('should fail to renounce ownership if not owner', async () => {
            await expect(ownable.connect(wallet3).renounceOwnership()).to.be.revertedWith(
                'Ownable/caller-not-owner',
            );
        });
    });

    describe('onlyOwner()', () => {
        it('should fail to call permissioned function if not owner', async () => {
            await expect(ownable.connect(wallet3).protectedFunction()).to.be.revertedWith(
                'Ownable/caller-not-owner',
            );
        });

        it('should call permissioned function if owner', async () => {
            await expect(ownable.protectedFunction()).to.emit(
                ownable,
                'ReallyCoolEvent',
            );
        });
    });
});
