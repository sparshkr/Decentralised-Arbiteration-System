// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DisputeMarketplace is Ownable {
    struct Dispute {
        uint256 id;
        address clientA;
        address clientB;
        string description;
        bool isResolved;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public disputeCount;

    event DisputeCreated(
        uint256 indexed disputeId,
        address indexed clientA,
        address indexed clientB,
        string description
    );
    event DisputeResolved(uint256 indexed disputeId);

    constructor(address initialOwner) Ownable(initialOwner) {
        disputeCount = 0;
    }

    function createDispute(
        address _clientB,
        string memory _description
    ) external {
        require(
            _clientB != msg.sender,
            "Cannot create a dispute with yourself"
        );
        require(bytes(_description).length > 0, "Description cannot be empty");

        disputeCount++;
        disputes[disputeCount] = Dispute({
            id: disputeCount,
            clientA: msg.sender,
            clientB: _clientB,
            description: _description,
            isResolved: false
        });

        emit DisputeCreated(disputeCount, msg.sender, _clientB, _description);
    }

    function resolveDispute(uint256 _disputeId) external onlyOwner {
        require(
            _disputeId > 0 && _disputeId <= disputeCount,
            "Invalid dispute ID"
        );
        require(
            !disputes[_disputeId].isResolved,
            "Dispute is already resolved"
        );

        //Some complex Calculation

        disputes[_disputeId].isResolved = true;

        emit DisputeResolved(_disputeId);
    }

    function getDispute(
        uint256 _disputeId
    ) external view returns (Dispute memory) {
        require(
            _disputeId > 0 && _disputeId <= disputeCount,
            "Invalid dispute ID"
        );
        return disputes[_disputeId];
    }

    function getDisputeCount() external view returns (uint256) {
        return disputeCount;
    }
}
