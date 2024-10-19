// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
    struct Dispute {
        uint256 id;
        address clientA;
        address clientB;
        string description;
        uint256 votingDeadline;
        bool isResolved;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 private disputeCount = 0;
    address private immutable DISPUTE_HANDLER;
    address private immutable GRULL_TOKEN_ADDRESS;
    address private immutable ESCROW;

    modifier ONLY_DISPUTE_HANDLER() {
        require(msg.sender == DISPUTE_HANDLER, "Access Denied!");
        _;
    }

    event DisputeCreated(
        uint256 indexed disputeId,
        address indexed clientA,
        address indexed clientB,
        string description,
        uint256 votingDeadline
    );
    event DisputeResolved(uint256 indexed disputeId);

    // Owner Need to be EOA / Multisig acc
    constructor(
        address tokenAddress,
        address disputeHandler,
        address escrowAddress
    ) Ownable(msg.sender) {
        GRULL_TOKEN_ADDRESS = tokenAddress;
        DISPUTE_HANDLER = disputeHandler;
        ESCROW = escrowAddress;
    }

    function createDispute(
        address _clientA,
        address _clientB,
        string memory _description,
        uint _votingDeadline
    ) external {
        require(_clientA != _clientB, "Two parties cant be same");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_votingDeadline > block.timestamp, "Voting deadline must be in the future");

        disputeCount++;
        disputes[disputeCount] = Dispute({
            id: disputeCount,
            clientA: _clientA,
            clientB: _clientB,
            description: _description,
            votingDeadline: _votingDeadline,
            isResolved: false
        });
        // send to disputeHandler
        // IDISPUTE_HANDLER(DISPUTE_HANDLER).submitForHandling(disputes[disputeCount]);

        emit DisputeCreated(
            disputeCount,
            _clientA,
            _clientB,
            _description,
            _votingDeadline
        );
    }

    // Only DISPUTE_HANDLER can call this function
    function resolveDispute(uint256 _disputeId) external ONLY_DISPUTE_HANDLER {
        require(
            _disputeId > 0 && _disputeId <= disputeCount,
            "Invalid dispute ID"
        );
        require(
            !disputes[_disputeId].isResolved,
            "Dispute is already resolved"
        );

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

    // function buyGRULL() external payable returns (uint256) {
    //     // The value of token: 1 GRULL = 0.01 ETH
    //     uint tokenAmount = msg.value*100;
    //     IGRULL(GRULL_TOKEN_ADDRESS).transfer(msg.sender, tokenAmount);
    // }
}
