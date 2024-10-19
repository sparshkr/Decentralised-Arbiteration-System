// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JuryNormaliser {
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

    // Helper function to calculate the log base 2
    // Helper function to calculate the log base 2
    function log2(uint x) internal pure returns (uint y) {
        while (x > 1) {
            x >>= 1;
            y++;
        }
    }
}
