import { useState, useEffect, useCallback } from "react";

import Navbar from './Navbar';
import NewProperty from './NewProperty';

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import realtor from "./contracts/realtor.abi.json";
import IERC from "./contracts/IERC.abi.json";
import { Properties } from "./Properties";

const ERC20_DECIMALS = 18;


const contractAddress = "0x13Af067A3bc1715243E6A90Bd07Bc6B9c7501467";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [propertiess, setProperties] = useState([]);
  const properties = [];


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const contract = new kit.web3.eth.Contract(realtor, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);


  


  const getProperties = useCallback(async () => {
    const propertiesLength = await contract.methods.getpropertiesLength().call();
    

    for (let index = 0; index < propertiesLength; index++) {
      let _properties = new Promise(async (resolve, reject) => {
      let property = await contract.methods.getProperties(index).call();

        resolve({
          index: index,
          owner: property[0],
          url: property[1],
          description: property[2],
          location: property[3],
          price: property[4],
          isForsale: property[5]     
        });
      });
      properties.push(_properties);
    }

    const _properties = await Promise.all(properties);
    setProperties(_properties);
  }, [contract]);


  const addProperty = async (
    _url,
    _description,
    _location,
    _price
  ) => {
    try {
      await contract.methods
        .addProperty(_url, _description, _location, _price)
        .send({ from: address });
      getProperties();
    } catch (error) {
      console.log(error);
    }
  };


  

  const buyProperty = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const cost = new BigNumber(propertiess[_index].price)
        .shiftedBy(ERC20_DECIMALS)
        .toString();
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods.BuyProperty(_index).send({ from: address });
      getProperties();
      getBalance();
    } catch (error) {
      console.log(error)
    }};

    const toggleForsale = async (_index) => {
      try {
        await contract.methods.setForsale(_index).send({ from: address });
        getProperties();
        getBalance();
      } catch (error) {
        console.log(error);
      }};

      const modifyPrice = async (_index, _newprice) => {
        try {
          const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
          await contract.methods.modifyPrice(_index, _newprice).send({ from: address });
          getProperties();
          getBalance();
        } catch (error) {
          console.log(error);
        }};

      

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getProperties();
    }
  }, [contract, getProperties]);


  
  return (
      <div className="">
    <Navbar cUSDBalance={cUSDBalance} />
  <Properties propertiess={propertiess} buyProperty ={buyProperty} toggleForsale={toggleForsale} modifyPrice={modifyPrice}/>
  <NewProperty addProperty={addProperty}/>
  </div>
  );
}


export default App;
