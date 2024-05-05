// VotingForm.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from "./Navbar";

const VotingForm = () => {
  const [proposalId, setProposalId] = useState('');
  const [voteWay, setVoteWay] = useState(1); // Default to "For"
  const [reason, setReason] = useState('');

  const voteFunction = async () => {
    // Call your vote function using ethers.js
    // Example: await dao.vote(proposalId, voteWay, reason);
  };

  const handleVote = async () => {
    try {
      await voteFunction();
      alert('Vote submitted successfully!');
    } catch (error) {
      alert('Error submitting vote!');
      console.error(error);
    }
  };

  return (
    <div className="">
        <Navbar></Navbar>
    <div>
      <h2>Vote on Proposal</h2>
      <label>
        Proposal ID:
        <input type="text" value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
      </label>
      <label>
        Vote:
        <select value={voteWay} onChange={(e) => setVoteWay(e.target.value)}>
          <option value={0}>Against</option>
          <option value={1}>For</option>
          <option value={2}>Abstain</option>
        </select>
      </label>
      <label>
        Reason:
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <button onClick={handleVote}>Vote</button>
    </div>
    </div>
  );
};

export default VotingForm;
