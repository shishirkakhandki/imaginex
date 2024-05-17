import React, { useState, useEffect } from 'react';

import Navbar from "./Navbar";
import { developmentChains, VOTING_DELAY, proposalsFile, FUNC } from "../helper-hardhat-config";
// const fs = require("fs");

const ethers = require("ethers");

const moveBlocks = async (amount) => {
  console.log("Moving blocks...")
  for (let index = 0; index < amount; index++) {
    await ethers.provider.send("evm_mine", [])
  }
  console.log(`Moved ${amount} blocks`)
};

const ProposalForm = () => {
  const [newPrice, setNewPrice] = useState('');
  const [description, setDescription] = useState('');
  const [proposalStatus, setProposalStatus] = useState('');

  useEffect(() => {
    if (proposalStatus) {
      alert(proposalStatus);
      setProposalStatus('');
    }
  }, [proposalStatus]);

  const proposeFunction = async () => {
    try {
      console.log("Here!!!!!!!!")
      const governor = await ethers.getContract("GovernorContract");
      console.log(governor.address);
      const nftMarketplace = await ethers.getContract("NFTMarketplace");
      const encodedFunctionCall = nftMarketplace.interface.encodeFunctionData(FUNC, [newPrice]);
      console.log(`Proposing ${FUNC} on ${nftMarketplace.address} with ${newPrice}`);
      console.log(`Proposal Description:\n  ${description}`);
      
      const proposeTx = await governor.propose(
        [nftMarketplace.address],
        [0],
        [encodedFunctionCall],
        description
      );

      // If working on a development chain, push forward until reaching the voting period.
      if (developmentChains.includes(ethers.provider.network.name)) {
        await moveBlocks(VOTING_DELAY + 1);
      }

      const proposeReceipt = await proposeTx.wait(1);
      const proposalId = proposeReceipt.events[0].args.proposalId;
      console.log(`Proposed with proposal ID:\n  ${proposalId}`);

      const proposalState = await governor.state(proposalId);
      const proposalSnapShot = await governor.proposalSnapshot(proposalId);
      const proposalDeadline = await governor.proposalDeadline(proposalId);

      // Save the proposalId
      // storeProposalId(proposalId);

      // Display current proposal state, snapshot, and deadline
      setProposalStatus(`
        Current Proposal State: ${proposalState}
        Current Proposal Snapshot: ${proposalSnapShot}
        Current Proposal Deadline: ${proposalDeadline}
      `);
    } catch (error) {
      alert('Error submitting proposal!');
      console.error(error);
    }
  };

  const handlePropose = async () => {
    try {
      await proposeFunction();
    } catch (error) {
      alert('Error submitting proposal!');
      console.error(error);
    }
  };

  // function storeProposalId(proposalId) {
  //   const chainId = ethers.provider.network.chainId.toString();
  //   let proposals;

  //   if (fs.existsSync(proposalsFile)) {
  //     proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  //   } else {
  //     proposals = {};
  //     proposals[chainId] = [];
  //   }

  //   proposals[chainId].push(proposalId.toString());
  //   fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
  // }

  return (
    <div className="">
      <Navbar />
      <div>
        <h2>Propose New Action</h2>
        <label>
          New Price:
          <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button onClick={handlePropose}>Propose</button>
      </div>
      {proposalStatus && (
        <div>
          <h3>Proposal Status</h3>
          <pre>{proposalStatus}</pre>
        </div>
      )}
    </div>
  );
};

export default ProposalForm;
