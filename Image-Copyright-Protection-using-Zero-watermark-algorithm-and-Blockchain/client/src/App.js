import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import RegisterImagesContract from "./contracts/RegisterImages.json";
import getWeb3 from "./getWeb3";
import DetailsScreen from "./screens/DetailsScreen";
import HomeScreen from "./screens/HomeScreen";
import UploadScreen from "./screens/UploadScreen";
import UserScreen from "./screens/UserScreen";
import ValidateScreen from "./screens/ValidateScreen";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Footer from "./components/Footer";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const ipfsClient = require('ipfs-http-client');
  const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

  useEffect(() => {
    const loadBC = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = RegisterImagesContract.networks[networkId];
        const instance = new web3.eth.Contract(
          RegisterImagesContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setContract(instance);
        setAccounts(accounts);
      } catch (err) {
        console.log(err);
      }
    };
    loadBC();
  }, []);

  if (!web3 || !contract || !accounts) {
    return (<>
      <div className="d-flex justify-content-center my-auto">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>)
  }
  return (
    <>
      <BrowserRouter>
        <Navbar account={accounts ? accounts[0] : ''} />
        <main>
          <Switch>
            <Route path='/' component={HomeScreen} exact />
            <Route path='/account' render={() => <UserScreen contract={contract} account={accounts ? accounts[0] : ''} />} />
            <Route path='/upload' render={() => <UploadScreen ipfs={ipfs} contract={contract} account={accounts ? accounts[0] : ''} />} />
            <Route path='/validate' render={() => <ValidateScreen />} />
            <Route path='/image/:id' render={() => <DetailsScreen contract={contract} account={accounts ? accounts[0] : ''} />} />
          </Switch>
        </main>
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  )
}

export default App;

// T8PGQtFRZq8KmP2