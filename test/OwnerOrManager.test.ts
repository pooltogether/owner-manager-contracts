import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';
import { Contract, ContractFactory, Signer, Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { Interface } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Test Set Name', () => {
    let ownerOrManager: Contract

    let wallet1: SignerWithAddress, wallet2: SignerWithAddress, wallet3: SignerWithAddress, wallet4: SignerWithAddress

    beforeEach(async () =>{
        [wallet1, wallet2, wallet3, wallet4] = await ethers.getSigners()

        const ownerOrManagerFactory: ContractFactory = await ethers.getContractFactory("OwnerOrManagerHarness")
        ownerOrManager = await ownerOrManagerFactory.deploy()
    })
    describe("setManager()", ()=>{
        it('Can set manager', async () => {
            await ownerOrManager.setManager(wallet2.address)
            expect(await ownerOrManager.manager()).to.equal(wallet2.address)
        })
    })

    describe("onlyManagerOrOwner()", ()=>{
        it('permissions correctly', async () => {
            await expect(ownerOrManager.connect(wallet3).protectedFunction()).to.be.revertedWith("Manager/caller-not-manager-or-owner")       
        })
    })

})