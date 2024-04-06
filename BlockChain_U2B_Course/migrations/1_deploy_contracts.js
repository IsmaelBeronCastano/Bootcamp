const fundMe = artifacts.require("FundMe")

module.exports = function(deployer){
    deployer.deploy(fundMe)
}

