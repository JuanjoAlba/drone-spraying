pragma solidity ^0.4.25;

/*
 * @title Interface for users
 *
 * @author Juan José Alba
 */
interface IUser {

    // Add new User
    function addUser (address _address, string _name, uint256 _role) external payable;
    
    // Get Data from user
    function getUserData (address _address) external view returns (string name, uint256 role);
    
}