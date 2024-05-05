import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import ReactDOM from "react-dom/client";
import ProposalForm from './components/ProposalForm';
import VotingForm from './components/VotingForm';
import QueueExecute from './components/QueueExecute';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Marketplace />}/>
          <Route path="/nftPage" element={<NFTPage />}/>        
          <Route path="/profile" element={<Profile />}/>
          <Route path="/sellNFT" element={<SellNFT />}/>   
          <Route path="/propose" element={<ProposalForm />}/> 
          <Route path="/vote" element={<VotingForm />}/> 
          <Route path="/execute" element={<QueueExecute />}/>           
        </Routes>
    </div>
  );
}

export default App;
