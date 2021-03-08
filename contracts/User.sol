pragma solidity ^0.4.25;

/**
 * @dev Implementation of Owner.
 * 
 */
contract User {
    
    uint constant ROLE_COMPANY = 0;
    uint constant ROLE_OWNER = 1;
    
    // Name
     struct userStruct {
         string name;
         uint256 role;
         }
         
    // Mapping users to roles
    mapping (address => userStruct) internal usersRole;
    
    constructor () public {}
    
    // Add new User
    function addUser (address _address, string _name, uint256 _role) public payable {
        
        usersRole[_address].name = _name;
        usersRole[_address].role = _role;
    }
    
    function getUserData (address _address) public view returns (string name, uint256 role) {
        
        return (
            usersRole[_address].name,
            usersRole[_address].role
        );
    }
    
}