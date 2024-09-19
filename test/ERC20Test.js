const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("ERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployERC20Tester() {

    // Contracts are deployed using the first signer/account by default
    const [owner, signer] = await ethers.getSigners();

    const ERC20Test = await ethers.getContractFactory("ERC20Test");
    const erc20test = await ERC20Test.deploy();
    console.log(owner.address)
    console.log(signer.address)
    return { erc20test, owner, signer };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { erc20test, signer, owner } = await loadFixture(deployERC20Tester);

      expect(await erc20test.owner()).to.equal(owner);
    });

  });
});