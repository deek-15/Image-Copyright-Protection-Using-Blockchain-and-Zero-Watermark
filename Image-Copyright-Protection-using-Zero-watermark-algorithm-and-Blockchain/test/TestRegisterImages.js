const assert = require("assert");

const RegisterImagesContract = artifacts.require("./contracts/RegisterImages.sol");

contract("RegisterImages", accounts => {
    it('Should upload image', async () => {
        const deployedContract = await RegisterImagesContract.deployed();
        console.log("Testing....")
        console.log(await deployedContract.callstatic.uploadImage("ighjnk34kih52e3", "Test title", "Test Desc"));
        assert.equal(2, 3, "Not Equal")
    });
});