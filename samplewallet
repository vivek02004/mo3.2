// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleWallet {
    address public owner;

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Function to deposit Ether into the contract
    function deposit() public payable {
        // Accept Ether, no additional logic required
    }

    // Function to get the balance of the contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Function to withdraw Ether from the contract
    function withdraw(uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(_amount);
    }

    // Function to transfer Ether to another address
    function transferTo(address payable _to, uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        _to.transfer(_amount);
    }

    // Function to receive Ether
    receive() external payable {
        // Automatically called when contract receives Ether
    }
}
