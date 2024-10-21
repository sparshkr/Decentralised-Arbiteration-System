// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    struct Juror {
        uint256 stakedAmount;
        bool hasVoted;
        address jurorAddress;
    }

    enum VoteType {
        None,
        A,
        B
    }

    struct Dispute {
        string sideA;
        string sideB;
        uint256 stakingEndTime;
        uint256 voteEndTime;
        uint256 totalVotesForA;
        uint256 totalVotesForB;
        bool votingOpen;
        address[] selectedJury;
        address[] jurorAddresses;
        mapping(address => Juror) jurors;
        mapping(address => VoteType) votes;
    }

    IERC20 public grullToken;
    uint256 public minStakeAmount;
    address public owner;
    uint256 public jurySize;

    mapping(uint256 => Dispute) public disputes;
    uint256 public disputeCount;

    event DisputeCreated(uint256 indexed disputeId, string sideA, string sideB);
    event JurySelected(uint256 indexed disputeId, address[] jury);
    event DisputeResolved(uint256 indexed disputeId, string winningSide);

    constructor(
        IERC20 _grullToken,
        uint256 _minStakeAmount,
        uint256 _jurySize
    ) {
        owner = msg.sender;
        grullToken = _grullToken;
        minStakeAmount = _minStakeAmount;
        jurySize = _jurySize;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyDuringStaking(uint256 _disputeId) {
        require(
            block.timestamp < disputes[_disputeId].stakingEndTime,
            "Staking period has ended"
        );
        _;
    }

    modifier onlyDuringVoting(uint256 _disputeId) {
        require(
            block.timestamp >= disputes[_disputeId].stakingEndTime,
            "Staking period is ongoing"
        );
        require(
            block.timestamp < disputes[_disputeId].voteEndTime,
            "Voting period has ended"
        );
        _;
    }

    modifier onlyAfterVoting(uint256 _disputeId) {
        require(
            block.timestamp >= disputes[_disputeId].voteEndTime,
            "Voting is still open"
        );
        _;
    }

    // Create a new dispute
    function createDispute(
        string memory _sideA,
        string memory _sideB,
        uint256 _stakingDuration,
        uint256 _votingDuration
    ) public onlyOwner {
        disputeCount++;

        disputes[disputeCount].sideA = _sideA;
        disputes[disputeCount].sideB = _sideB;
        disputes[disputeCount].stakingEndTime =
            block.timestamp +
            _stakingDuration;
        disputes[disputeCount].voteEndTime =
            disputes[disputeCount].stakingEndTime +
            _votingDuration;
        disputes[disputeCount].votingOpen = true;

        emit DisputeCreated(disputeCount, _sideA, _sideB);
    }

    // Stake tokens to become a juror
    function stakeTokens(
        uint256 _disputeId,
        uint256 _amount
    ) public onlyDuringStaking(_disputeId) {
        require(
            _amount >= minStakeAmount,
            "Stake must meet minimum requirement"
        );
        grullToken.transferFrom(msg.sender, address(this), _amount);

        Dispute storage dispute = disputes[_disputeId];

        dispute.jurors[msg.sender].stakedAmount += _amount;
        dispute.jurorAddresses.push(msg.sender);
    }

    // Select jury members after staking ends
    function selectJury(
        uint256 _disputeId
    ) public onlyOwner onlyDuringVoting(_disputeId) {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.selectedJury.length == 0, "Jury already selected");

        address[] memory jury = new address[](jurySize);
        uint256 totalStakedAmount = 0;

        // Calculate total staked amount for all jurors
        for (uint256 i = 0; i < dispute.jurorAddresses.length; i++) {
            totalStakedAmount += dispute
                .jurors[dispute.jurorAddresses[i]]
                .stakedAmount;
        }

        // Randomly select jurors based on staking amount
        for (uint256 i = 0; i < jurySize; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % dispute.jurorAddresses.length;
            jury[i] = dispute.jurorAddresses[randomIndex];
        }

        dispute.selectedJury = jury;

        emit JurySelected(_disputeId, jury);
    }

    // Cast a vote
    function vote(
        uint256 _disputeId,
        VoteType _vote
    ) public onlyDuringVoting(_disputeId) {
        require(_vote != VoteType.None, "Invalid vote");
        Dispute storage dispute = disputes[_disputeId];
        require(!dispute.jurors[msg.sender].hasVoted, "Already voted");
        require(
            isSelectedJuror(_disputeId, msg.sender),
            "Not selected as a juror"
        );

        dispute.jurors[msg.sender].hasVoted = true;
        dispute.votes[msg.sender] = _vote;

        if (_vote == VoteType.A) {
            dispute.totalVotesForA++;
        } else {
            dispute.totalVotesForB++;
        }
    }

    // Check if address is part of selected jury
    function isSelectedJuror(
        uint256 _disputeId,
        address _juror
    ) internal view returns (bool) {
        Dispute storage dispute = disputes[_disputeId];
        for (uint256 i = 0; i < dispute.selectedJury.length; i++) {
            if (dispute.selectedJury[i] == _juror) {
                return true;
            }
        }
        return false;
    }

    // Resolve the dispute
    function resolveDispute(
        uint256 _disputeId
    ) public onlyOwner onlyAfterVoting(_disputeId) {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.votingOpen, "Dispute already resolved");

        string memory winningSide;
        bool isSideAWinner = dispute.totalVotesForA > dispute.totalVotesForB;

        if (isSideAWinner) {
            winningSide = dispute.sideA;
        } else {
            winningSide = dispute.sideB;
        }

        emit DisputeResolved(_disputeId, winningSide);

        uint256 totalWinningStake = 0;
        uint256 totalLosingStake = 0;

        // Calculate total stake of winning jurors and losing jurors
        for (uint256 i = 0; i < dispute.selectedJury.length; i++) {
            if (
                (isSideAWinner &&
                    dispute.votes[dispute.selectedJury[i]] == VoteType.A) ||
                (!isSideAWinner &&
                    dispute.votes[dispute.selectedJury[i]] == VoteType.B)
            ) {
                totalWinningStake += dispute
                    .jurors[dispute.selectedJury[i]]
                    .stakedAmount;
            } else {
                totalLosingStake += dispute
                    .jurors[dispute.selectedJury[i]]
                    .stakedAmount;
            }
        }

        // Distribute staked tokens to the winning jurors based on their percentage of the total winning stake
        for (uint256 i = 0; i < dispute.selectedJury.length; i++) {
            if (
                (isSideAWinner &&
                    dispute.votes[dispute.selectedJury[i]] == VoteType.A) ||
                (!isSideAWinner &&
                    dispute.votes[dispute.selectedJury[i]] == VoteType.B)
            ) {
                uint256 jurorStake = dispute
                    .jurors[dispute.selectedJury[i]]
                    .stakedAmount;
                uint256 reward = jurorStake +
                    ((jurorStake * totalLosingStake) / totalWinningStake);
                grullToken.transfer(dispute.selectedJury[i], reward);
            }
        }

        // Return staked tokens to unselected jurors
        for (uint256 i = 0; i < dispute.jurorAddresses.length; i++) {
            if (!isSelectedJuror(_disputeId, dispute.jurorAddresses[i])) {
                grullToken.transfer(
                    dispute.jurorAddresses[i],
                    dispute.jurors[dispute.jurorAddresses[i]].stakedAmount
                );
            }
        }

        dispute.votingOpen = false;
    }
}
