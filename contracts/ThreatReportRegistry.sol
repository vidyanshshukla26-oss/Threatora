// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ThreatReportRegistry
 * @dev Decentralized, tamper-evident registry for Threatora security intelligence reports.
 * Stores canonical SHA-256 integrity commitments offloaded from off-chain investigation data.
 */
contract ThreatReportRegistry {
    struct ThreatReport {
        string reportId;
        bytes32 hashCommitment;   // Canonical SHA-256 hash of off-chain report data
        string target;            // Domain or normalized URL
        string threatCategory;    // e.g. "Phishing", "TLS Compromise", "Smishing"
        address reporter;         // Submitting security analyst or decentralized node
        uint256 timestamp;        // Block timestamp
        bool exists;
    }

    // Mapping from reportId => ThreatReport
    mapping(string => ThreatReport) public reports;

    // Mapping from hashCommitment => reportId
    mapping(bytes32 => string) public commitmentToReportId;

    // Total registered reports
    uint256 public totalReportsCount;

    // Array of all report IDs for on-chain enumeration
    string[] public reportIds;

    // Events
    event ThreatReportRegistered(
        string indexed reportId,
        bytes32 indexed hashCommitment,
        string target,
        string threatCategory,
        address indexed reporter,
        uint256 timestamp
    );

    error ReportAlreadyExists(string reportId);
    error CommitmentAlreadyRegistered(bytes32 commitment);
    error InvalidInput();

    /**
     * @notice Registers a new threat report with its cryptographic commitment.
     * @param reportId Unique report identifier (e.g. "TR-2026-8841")
     * @param hashCommitment Canonical SHA-256 hash calculated from off-chain report JSON
     * @param target The investigated domain or URL
     * @param threatCategory Category classification
     */
    function registerReport(
        string calldata reportId,
        bytes32 hashCommitment,
        string calldata target,
        string calldata threatCategory
    ) external {
        if (bytes(reportId).length == 0 || hashCommitment == bytes32(0)) {
            revert InvalidInput();
        }
        if (reports[reportId].exists) {
            revert ReportAlreadyExists(reportId);
        }
        if (bytes(commitmentToReportId[hashCommitment]).length != 0) {
            revert CommitmentAlreadyRegistered(hashCommitment);
        }

        reports[reportId] = ThreatReport({
            reportId: reportId,
            hashCommitment: hashCommitment,
            target: target,
            threatCategory: threatCategory,
            reporter: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        commitmentToReportId[hashCommitment] = reportId;
        reportIds.push(reportId);
        totalReportsCount++;

        emit ThreatReportRegistered(
            reportId,
            hashCommitment,
            target,
            threatCategory,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Verifies whether a given recalculated hash matches the on-chain stored commitment.
     * @param reportId The report ID to verify
     * @param candidateHash The recalculated hash computed from off-chain report data
     * @return isValid True if candidate hash exactly matches the on-chain commitment
     * @return storedCommitment The cryptographic commitment stored in the contract
     */
    function verifyReport(string calldata reportId, bytes32 candidateHash)
        external
        view
        returns (bool isValid, bytes32 storedCommitment)
    {
        ThreatReport memory report = reports[reportId];
        if (!report.exists) {
            return (false, bytes32(0));
        }
        return (report.hashCommitment == candidateHash, report.hashCommitment);
    }

    /**
     * @notice Returns total number of registered reports.
     */
    function getReportCount() external view returns (uint256) {
        return totalReportsCount;
    }
}
