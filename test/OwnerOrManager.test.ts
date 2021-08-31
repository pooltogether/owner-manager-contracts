import { expect } from 'chai';
import { Contract, ContractFactory, Signer, Wallet } from 'ethers';
import { ethers } from 'hardhat';
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
            expect(await ownerOrManager.setManager(wallet2.address)).to.emit(ownerOrManager, 'ManagerTransferred')
            expect(await ownerOrManager.manager()).to.equal(wallet2.address)
        })
    })

    describe("onlyManagerOrOwner()", ()=>{
        it('non owner non manager cannot call permissioned function', async () => {
            await expect(ownerOrManager.connect(wallet3).protectedFunction()).to.be.revertedWith("Manager/caller-not-manager-or-owner")       
        })

        it('non owner non manager cannot call permissioned function', async () => {
            await expect(ownerOrManager.protectedFunction()).to.emit(ownerOrManager, "ReallyCoolEvent")  
            await ownerOrManager.setManager(wallet2.address)      
            await expect(ownerOrManager.connect(wallet2).protectedFunction()).to.emit(ownerOrManager, "ReallyCoolEvent")
        })

        it('manager cannot set new manage', async ()=> {
            await expect(ownerOrManager.connect(wallet2).protectedFunction()).to.be.reverted
        })
    })

})