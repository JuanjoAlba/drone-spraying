pragma solidity ^0.4.20;

/**
 * @dev Implementation of Company.
 * 
 */
contract Company {
    
    // Name
    string name;

    constructor (string _name) public {
        
        name = _name;
    }
    
}