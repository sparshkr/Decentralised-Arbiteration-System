// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Dispute {
    uint256 id;
    address creator;
    address clientA;
    address clientB;
    string description;
    uint[] skillsReqd ;
    uint256 votingDeadline;
    bool isResolved;
    address winner;
}

contract Marketplace is Ownable {

    mapping(uint256 => Dispute) public disputes;
    uint256 private disputeCount = 0;
    address private immutable DISPUTE_HANDLER;
    address private immutable GRULL_TOKEN_ADDRESS;
    mapping(address => uint) public lastPurchase;

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
    event DisputeResolved(uint256 indexed disputeId, address winner);

    // Owner Need to be EOA / Multisig acc
    constructor(
        address tokenAddress,
        address disputeHandler
    ) Ownable(msg.sender) {
        GRULL_TOKEN_ADDRESS = tokenAddress;
        DISPUTE_HANDLER = disputeHandler;
    }

    //************* For Dispute Creators ************//
    function createDispute(
        address _clientA,
        address _clientB,
        string memory _description,
        uint _votingDeadline,
        uint[] memory _skillsReqd
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
            skillsReqd: _skillsReqd,
            votingDeadline: _votingDeadline,
            isResolved: false,
            winner: address(0)
        });
        // send to disputeHandler
        bool submitted = IDISPUTE_HANDLER(DISPUTE_HANDLER).handleCreateDispute(disputes[disputeCount], disputeCount);
        require(submitted,"Failed to submit.");
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
    function getDisputeResolved(uint256 _disputeId) external returns (bool, address) {
        require(
            _disputeId > 0 && _disputeId <= disputeCount,
            "Invalid dispute ID"
        );
        require(
            !disputes[_disputeId].isResolved,
            "Dispute is already resolved"
        );
        require(disputes[_disputeId].creator == msg.sender, "Access denied");

        (bool isSettled, address winner) = IDISPUTE_HANDLER(DISPUTE_HANDLER).settleDispute(
            _disputeId
        );
        require(isSettled, "Error with settlement");

        disputes[_disputeId].isResolved = true;
        disputes[_disputeId].winner = winner;

        emit DisputeResolved(_disputeId, winner);

        return (isSettled, winner);
    }

    function getDispute(uint256 _disputeId) external view returns (Dispute memory) {
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
    //************* For Dispute Creators ************//

    //************* For Jury Members ************//
    function stakeAndVote(
        uint256 disputeId,
        bool voteForA,
        uint256 stakeAmount,
        uint[] memory skills
    ) external {
        require(
            disputes[disputeId].votingDeadline > block.timestamp,
            "Voting deadline passed"
        );
        IDISPUTE_HANDLER(DISPUTE_HANDLER).stakeAndVote(disputeId, voteForA, stakeAmount, skills);
    }
    //************* For Jury Members ************//

    //************* General Utility ************//
    function buyGRULL() external payable returns (bool) {
        uint256 maxPurchaseLimit = 1000 * 10**18;
        uint256 timeLimit = 1 hours;

        require(msg.value > 0, "Send some ETH to buy GRULL Tokens");
        
        require(
            block.timestamp - lastPurchase[msg.sender] >= timeLimit,
            "Can only purchase once every 24 hours"
        );

        uint256 currentPrice = calculatePrice();
        uint256 tokenAmount = (msg.value * 10**18) / currentPrice ; // Adjust based on dynamic price
        require(tokenAmount <= maxPurchaseLimit, "Exceeds purchase limit");

        // @DEV Fix return
        IGRULL(GRULL_TOKEN_ADDRESS).mint(msg.sender, tokenAmount);
        // require(status, "Token transfer failed");

        lastPurchase[msg.sender] = block.timestamp;

        return true;
    }

    function calculatePrice() public view returns (uint256) {
        uint256 basePrice = 0.01 ether; // Starting price
        uint256 supplyFactor = 1000000 * 10**18; // Total supply impact on price
        uint256 totalSupply = IGRULL(GRULL_TOKEN_ADDRESS).totalSupply();
        
        // Simple bonding curve logic for dynamic pricing (price increases with supply)
        return basePrice + ((totalSupply * basePrice) / supplyFactor);
    }

    function setApproveDisputeHandler() public onlyOwner returns (bool) {
        IGRULL(GRULL_TOKEN_ADDRESS).approve(DISPUTE_HANDLER,1000000 * 10**18);
        return true;
    }

    //************* General Utility ************//

    function withdrawFunds() public payable onlyOwner{
        (bool sent, bytes memory data) = msg.sender.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        return;
    }

    function getGRULLOwnership() public onlyOwner{
        IGRULL(GRULL_TOKEN_ADDRESS).transferOwnership(msg.sender);
        return;
    }
}

interface IGRULL {
    // ERC20 standard functions
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transferOwnership(address newOwner) external;

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

    function settleDispute(uint) external returns (bool, address);
    function handleCreateDispute(Dispute memory, uint) external returns (bool);
    function stakeAndVote(
        uint256 disputeId,
        bool voteForA,
        uint256 stakeAmount,
        uint[] memory skills
    ) external;
    // more fns to be added
}
