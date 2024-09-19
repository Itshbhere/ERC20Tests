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
    return { erc20test, owner, signer, AmountofOwner };
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
});