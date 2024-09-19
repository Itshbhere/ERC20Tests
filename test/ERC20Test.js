const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployERC20Tester() {

    const decimals = 18;
    // Contracts are deployed using the first signer/account by default
    const [owner, signer] = await ethers.getSigners();

    const ERC20Test = await ethers.getContractFactory("ERC20Test");
    const erc20test = await ERC20Test.deploy();
    const AmountofOwner = BigInt(1000000) * BigInt(10) ** BigInt(decimals)
    const MintAmount = BigInt(100000)
    const TransferAmount = BigInt(100000)
    return { TransferAmount, erc20test, owner, signer, AmountofOwner, MintAmount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { erc20test, owner } = await loadFixture(deployERC20Tester);

      expect(await erc20test.owner()).to.equal(owner);
    });

    it("Should send the right amount of erc20 to owner", async function () {
      const { erc20test, AmountofOwner, owner } = await loadFixture(deployERC20Tester);

      expect(await erc20test.balanceOf(owner)).to.equal(AmountofOwner);
    });
  });
  describe("Minting", function () {

    it("should mint amount of tokens for the minter", async function () {

      const { erc20test, owner, MintAmount } = await loadFixture(deployERC20Tester);
      const FinalResult = (await erc20test.balanceOf(owner)) + BigInt(MintAmount)
      await erc20test.mint(owner, MintAmount)
      expect(await erc20test.balanceOf(owner)).to.equal(FinalResult)
    })

  })

  describe("OwnerShip", function () {
    it("should transfer the ownership to other account ", async function () {
      const { erc20test, signer } = await loadFixture(deployERC20Tester);
      await erc20test.transferOwnership(signer)
      expect(await erc20test.owner()).to.equal(signer)
    })
  })

  describe("Tranfer Of Tokens ", function () {
    it("should transfer the tokens from the sender to the receiver", async function () {
      const { erc20test, TransferAmount, signer, owner } = await loadFixture(deployERC20Tester)
      const TransferReceiver = await erc20test.balanceOf(signer)
      const TransferSender = await erc20test.balanceOf(owner)

      const AfterTransferReceiver = TransferReceiver + BigInt(TransferAmount)
      const AfterTransferSender = TransferSender - BigInt(TransferAmount)

      await erc20test.transfer(signer, BigInt(TransferAmount))

      expect(await erc20test.balanceOf(signer)).to.equal(AfterTransferReceiver)
      expect(await erc20test.balanceOf(owner)).to.equal(AfterTransferSender)

    })

    it("should approve the spender for specific amount", async function () {
      const { erc20test, TransferAmount, signer, owner } = await loadFixture(deployERC20Tester)
      await erc20test.approve(signer.address, BigInt(TransferAmount))
      expect(await erc20test.allowance(owner, signer.address)).to.equal(BigInt(TransferAmount))

    })

    it("should be able to send token from behalf of the approver", async function () {
      const { erc20test, TransferAmount, signer, owner } = await loadFixture(deployERC20Tester)
      await erc20test.approve(signer.address, BigInt(TransferAmount))
      const Amount = BigInt(await erc20test.allowance(owner.address, signer.address))
      const Equalizer = Amount + (await erc20test.balanceOf(signer.address))
      await erc20test.connect(signer).transferFrom(owner.address, signer.address, TransferAmount)
      expect(await erc20test.balanceOf(signer.address)).to.equal(Equalizer)

    })

  })
});