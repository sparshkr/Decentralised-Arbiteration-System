// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
    struct Dispute {
        uint256 id;
        address creator;
        address clientA;
        address clientB;
        string description;
        uint[] skillsReqd ;
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
        address indexed creator,
        address clientA,
        address clientB,
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
        require(
            _votingDeadline > block.timestamp,
            "Voting deadline must be in the future"
        );

        disputeCount++;
        disputes[disputeCount] = Dispute({
            id: disputeCount,
            creator: msg.sender,
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
            msg.sender,
            _clientA,
            _clientB,
            _description,
            _votingDeadline
        );
    }

    // Only DISPUTE creator can call this function
    function getDisputeResolved(uint256 _disputeId) external {
        require(
            _disputeId > 0 && _disputeId <= disputeCount,
            "Invalid dispute ID"
        );
        require(
            !disputes[_disputeId].isResolved,
            "Dispute is already resolved"
        );
        require(disputes[_disputeId].creator == msg.sender, "Access denied");

        bool isSettled = IDISPUTE_HANDLER(DISPUTE_HANDLER).settleDispute(
            _disputeId
        );
        require(isSettled, "Error with settlement");

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

    function getDisputeStatus(uint256 _disputeId) external view returns (bool) {
        require(
            _disputeId > 0 && _disputeId <= disputeCount,
            "Invalid dispute ID"
        );
        return disputes[_disputeId].isResolved;
    }

    function getDisputeCount() external view returns (uint256) {
        return disputeCount;
    }

    function buyGRULL() external payable returns (bool) {
        // The value of token: 1 GRULL = 0.01 ETH
        uint tokenAmount = msg.value * 100;
        bool status = IGRULL(GRULL_TOKEN_ADDRESS).transfer(
            msg.sender,
            tokenAmount
        );
        return status;
    }
}

interface IGRULL {
    // ERC20 standard functions
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    // ERC20Burnable extension
    function burn(uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;

    // ERC20Pausable extension
    function pause() external;

    function unpause() external;

    function paused() external view returns (bool);

    // ERC20Mintable functionality
    function mint(address to, uint256 amount) external;

    // ERC20Permit extension
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function nonces(address owner) external view returns (uint256);

    function DOMAIN_SEPARATOR() external view returns (bytes32);

    // ERC20Votes extension
    function getVotes(address account) external view returns (uint256);

    function delegate(address delegatee) external;

    function delegates(address account) external view returns (address);

    function clock() external view returns (uint48);

    function CLOCK_MODE() external pure returns (string memory);

    function castVote(
        uint256 proposalId,
        uint8 support
    ) external returns (uint256);

    // ERC20FlashMint extension
    function maxFlashLoan(address token) external view returns (uint256);

    function flashFee(
        address token,
        uint256 amount
    ) external view returns (uint256);

    function flashLoan(
        address receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Paused(address account);
    event Unpaused(address account);
}

interface IDISPUTE_HANDLER {
    function settleDispute(uint) external returns (bool);
    // more fns to be added
}
