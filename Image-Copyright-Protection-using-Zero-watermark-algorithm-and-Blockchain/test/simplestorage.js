const RegisterImagesContract = artifacts.require("./contracts/RegisterImages.sol");

contract("SimpleStorage", accounts => {
  it("...should store the value 89.", async () => {
    const register = await RegisterImagesContract.deployed();

    // Set value of 89
    console.log(await register.callstatic.uploadImage("", "titile", "description"));


    // Get stored value
    // const storedData = await simpleStorageInstance.get.call();

    // assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
