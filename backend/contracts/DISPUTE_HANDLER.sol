// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract DisputeHandler is Ownable {
    enum Skill {
        NONE,
        Web2,
        ML,
        Finance,
        FinTech,
        Management,
        Legal,
        Blockchain,
        AWS,
        UI_Design
    }

    struct JuryMember {
        address member;
        uint256 stakeAmount;
        uint[] skillset;
        bool isConsidered;
        bool votedForA;
    }

    struct Dispute {
        uint256 id;
        address clientA;
        address clientB;
        uint[] skillsReqd;
        uint256 votingDeadline;
        bool isResolved;
        uint256 totalStaked;
        uint256 votesForA;
        uint256 votesForB;
        mapping(address => JuryMember) juryVotes;
        address[] juryAddresses;
    }

    mapping(uint256 => Dispute) public disputes;
    IERC20 public grullToken;
    address public immutable GRULL_TOKEN_ADDRESS;

    event DisputeSettled(uint256 disputeId, address winner, address loser);

    constructor(address _grullToken) Ownable(msg.sender) {
        GRULL_TOKEN_ADDRESS = _grullToken;
        grullToken = IERC20(_grullToken);
    }

    // Jury member stakes GRULL and votes
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
        require(
            disputes[disputeId].juryVotes[msg.sender].stakeAmount == 0,
            "Already voted"
        );

        grullToken.transferFrom(msg.sender, address(this), stakeAmount);
        disputes[disputeId].juryVotes[msg.sender] = JuryMember({
            member: msg.sender,
            stakeAmount: stakeAmount,
            skillset: skills,
            isConsidered: false,
            votedForA: voteForA
        });
        disputes[disputeId].juryAddresses.push(msg.sender);
        disputes[disputeId].totalStaked += stakeAmount;

        if (voteForA) {
            disputes[disputeId].votesForA++;
        } else {
            disputes[disputeId].votesForB++;
        }
    }

    function handleCreateDispute(IMARKETPLACE.Dispute memory _newDispute, uint disputeCount) external returns (bool) {
        Dispute storage newDispute = disputes[disputeCount];
        newDispute.id = disputeCount;
        newDispute.clientA = _newDispute.clientA;
        newDispute.clientB = _newDispute.clientB;
        newDispute.skillsReqd = _newDispute.skillsReqd;
        newDispute.votingDeadline = _newDispute.votingDeadline;
        newDispute.isResolved = false;
        newDispute.totalStaked = 0;
        newDispute.votesForA = 0;
        newDispute.votesForB = 0;
        return true;
    }


    // Settlement function that evaluates votes based on skill matching
    function settleDispute(uint256 disputeId) external returns (bool, address) {
        Dispute storage dispute = disputes[disputeId];
        require(!dispute.isResolved, "Dispute already resolved");
        require(
            dispute.votingDeadline < block.timestamp,
            "Voting still ongoing"
        );

        // Calculate weighted votes based on skillset match
        uint256 totalVotes = dispute.votesForA + dispute.votesForB;
        uint256 topJuryCount = (totalVotes * 60) / 100;

        address[] memory topJury = _getTopJury(disputeId, topJuryCount);
        uint256 votesForAWeighted;
        uint256 votesForBWeighted;

        for (uint256 i = 0; i < topJury.length; i++) {
            JuryMember storage juror = dispute.juryVotes[topJury[i]];
            juror.isConsidered = true; // Marking the juror as considered.

            uint256 weight = _calculateWeight(
                juror.skillset,
                dispute.skillsReqd
            );

            if (juror.votedForA) {
                votesForAWeighted += weight;
            } else {
                votesForBWeighted += weight;
            }
        }

        // Determine the winner
        address winner;
        address loser;

        if (votesForAWeighted > votesForBWeighted) {
            winner = dispute.clientA;
            loser = dispute.clientB;
        } else {
            winner = dispute.clientB;
            loser = dispute.clientA;
        }

        // Distribute rewards
        _distributeRewards(disputeId, winner);

        dispute.isResolved = true;
        emit DisputeSettled(disputeId, winner, loser);

        return (true, winner);
    }

    // Calculate the top 60% of jurors based on skillset match
    function _getTopJury(
        uint256 disputeId,
        uint256 topJuryCount
    ) internal view returns (address[] memory) {
        Dispute storage dispute = disputes[disputeId];
        address[] memory sortedJury = dispute.juryAddresses;

        // Sort jury members by skillset match (simplified sorting here)
        // More advanced sorting logic can be implemented as needed.

        // Returning a portion of the top matched jury members.
        uint256 cutoff = topJuryCount < sortedJury.length
            ? topJuryCount
            : sortedJury.length;

        address[] memory topJury = new address[](cutoff);
        for (uint256 i = 0; i < cutoff; i++) {
            topJury[i] = sortedJury[i];
        }

        return topJury;
    }

    // Function to calculate jury weight based on skills match
    function _calculateWeight(
        uint[] memory jurorSkills,
        uint[] memory disputeSkills
    ) internal pure returns (uint256) {
        uint256 matchingSkills = 0;

        for (uint256 i = 0; i < jurorSkills.length; i++) {
            for (uint256 j = 0; j < disputeSkills.length; j++) {
                if (jurorSkills[i] == disputeSkills[j]) {
                    matchingSkills++;
                }
            }
        }

        return matchingSkills;
    }

    // Function to distribute rewards to winning jury members
    function _distributeRewards(uint256 disputeId, address winner) internal {
        Dispute storage dispute = disputes[disputeId];
        uint256 totalLoserStake = 0;

        for (uint256 i = 0; i < dispute.juryAddresses.length; i++) {
            JuryMember memory juror = dispute.juryVotes[
                dispute.juryAddresses[i]
            ];
            if (juror.isConsidered) {
                if (
                    (juror.votedForA && winner == dispute.clientA) ||
                    (!juror.votedForA && winner == dispute.clientB)
                ) {
                    //
                } else {
                    totalLoserStake += juror.stakeAmount;
                }
            }
        }
        for (uint256 i = 0; i < dispute.juryAddresses.length; i++) {
            JuryMember memory juror = dispute.juryVotes[
                dispute.juryAddresses[i]
            ];

            if (juror.isConsidered) {
                if (
                    (juror.votedForA && winner == dispute.clientA) ||
                    (!juror.votedForA && winner == dispute.clientB)
                ) {
                    // Winner juror gets their stake back + reward
                    uint256 reward = juror.stakeAmount +
                        totalLoserStake *
                        (juror.stakeAmount / dispute.totalStaked);
                    bool success = grullToken.transfer(juror.member, reward);
                    require(success, "Error in settling trades");
                } else {
                    bool success = grullToken.transfer(
                        juror.member,
                        juror.stakeAmount
                    );
                    require(success, "Error in settling trades");
                }
            }
        }
    }

    function normaliser(
        uint256 stakedAmount,
        uint256[] memory jurySkills,
        uint256[] memory requiredSkills
    ) public pure returns (uint256) {
        uint256 matchedSkills = 0;
        uint256 totalSkills = requiredSkills.length;

        // Ensure requiredSkills array is not empty to prevent division by zero
        require(totalSkills > 0, "requiredSkills array must not be empty");

        // Find the number of matched skills
        for (uint256 i = 0; i < totalSkills; i++) {
            for (uint256 j = 0; j < jurySkills.length; j++) {
                if (requiredSkills[i] == jurySkills[j]) {
                    matchedSkills++;
                    break;
                }
            }
        }

        // Define new weightage factors
        uint256 maxStakeWeight = 30; // Reduced max contribution from stake
        uint256 maxSkillsWeight = 70; // Increased max contribution from skills

        // Normalize the stake within a reasonable range (logarithmic scale)
        uint256 stakeScore;
        if (stakedAmount == 0) {
            stakeScore = 0; // No stake, no score
        } else {
            // Logarithmic scaling for staked amount to reduce dominance of small differences
            stakeScore =
                (maxStakeWeight * log2(stakedAmount + 1)) /
                log2(1000 + 1);
        }

        // Calculate skills score (prioritizing matched skills)
        uint256 skillsScore = (matchedSkills * maxSkillsWeight) / totalSkills;

        // Final score is the sum of stake score and skills score
        uint256 finalScore = stakeScore + skillsScore;

        // Ensure the final score is within the bounds of 1 to 100
        if (finalScore > 100) {
            finalScore = 100;
        } else if (finalScore < 1) {
            finalScore = 1;
        }

        return finalScore;
    }

    function log2(uint x) internal pure returns (uint y) {
        while (x > 1) {
            x >>= 1;
            y++;
        }
    }

    function setGRULLApproveal(address _address) public onlyOwner returns (bool) {
        IGRULL(GRULL_TOKEN_ADDRESS).approve(_address, 1000000 * 10**18);
        return true;
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

interface IMARKETPLACE {
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
}
