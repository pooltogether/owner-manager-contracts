import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const { constants } = ethers;
const { AddressZero } = constants;

describe('Manageable', () => {
    let manageable: Contract;

    let contractsOwner: SignerWithAddress,
        wallet2: SignerWithAddress,
        wallet3: SignerWithAddress,
        wallet4: SignerWithAddress;

    beforeEach(async () => {
        [contractsOwner, wallet2, wallet3, wallet4] = await ethers.getSigners();

        const manageableFactory = await ethers.getContractFactory('ManageableHarness');

        manageable = await manageableFactory.deploy(contractsOwner.address);
    });

    describe('manager()', () => {
        it('should be address zero by default', async () => {
            expect(await manageable.manager()).to.equal(AddressZero);
        });
    });

    describe('setManager()', () => {
        it('should set manager', async () => {
            expect(await manageable.setManager(wallet2.address))
                .to.emit(manageable, 'ManagerTransferred')
                .withArgs(AddressZero, wallet2.address);

            expect(await manageable.manager()).to.equal(wallet2.address);
        });

        it('should set manager to address zero', async () => {
            await manageable.setManager(wallet2.address);

            expect(await manageable.setManager(AddressZero))
                .to.emit(manageable, 'ManagerTransferred')
                .withArgs(wallet2.address, AddressZero);

            expect(await manageable.manager()).to.equal(AddressZero);
        });

        it('should fail to set manager if already manager', async () => {
            await manageable.setManager(wallet2.address);

            await expect(manageable.setManager(wallet2.address)).to.be.revertedWith(
                'Manageable/existing-manager-address',
            );
        });
    });

    describe('onlyManagerOrOwner()', () => {
        it('should fail to call permissioned function if not manager', async () => {
            await expect(manageable.connect(wallet3).protectedFunction()).to.be.revertedWith(
                'Manageable/caller-not-manager',
            );
        });

        it('should call permissioned function if manager', async () => {
            await manageable.setManager(wallet2.address);
            await expect(manageable.connect(wallet2).protectedFunction()).to.emit(
                manageable,
                'ReallyCoolEvent',
            );
        });
    });
});
