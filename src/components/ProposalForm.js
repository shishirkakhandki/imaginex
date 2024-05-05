// ProposalForm.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from "./Navbar";

const ProposalForm = () => {
  const [args, setArgs] = useState('');
  const [description, setDescription] = useState('');

  const proposeFunction = async () => {
    // Call your propose function using ethers.js
    // Example: await dao.propose(args.split(','), description);
  };

  const handlePropose = async () => {
    try {
      await proposeFunction();
      alert('Proposal submitted successfully!');
    } catch (error) {
      alert('Error submitting proposal!');
      console.error(error);
    }
  };

  return (
    <div className="">
    <Navbar></Navbar>
    <div>
      <h2>Propose New Action</h2>
      <label>
        Arguments (comma-separated):
        <input type="text" value={args} onChange={(e) => setArgs(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button onClick={handlePropose}>Propose</button>
    </div>
    </div>
  );
};

export default ProposalForm;
