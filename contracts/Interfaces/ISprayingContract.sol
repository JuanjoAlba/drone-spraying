pragma solidity ^0.4.25;

/*
 * @title Intereface for the application contract
 *
 * @dev This contract manages the aplication, adding drons to companies, plots to owners,
 *      managing request for spraying and working as a proxy for payments.
 *
 * @author Juan José Alba
 */
interface ISprayingContract {

    function giveTokens (uint256 _amount) external;
    
    /*
     * Hire dron to spray land
     *
     * This operation is called by the owner of plots
     */
    function registerPlot (uint256 _plotId) external payable returns (bool);

    /*
     * Spray plot with dron
     *
     * This operation is called by the company
     */
    function sprayPlot (uint256 _plotToSpray) external payable returns (uint256 _droneId);
    
    /*
     * Get the plot ids wating to be sprayed
     *
     * This operation is called by the company
     */
    function getjobsToDo () external view returns (uint256[5] memory jobsToDo);
    
    /*
     * Get sprayed plot ids
     *
     * This operation is called by the owner of plots
     */
    function getjobsDone () external view returns (uint256[] jobsDone);
}