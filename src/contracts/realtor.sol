// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}



contract celoHousing {
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;


    uint internal propertiesLength = 0;

    struct Property {
        address payable owner;
        string url;
        string description;
        string location;
        uint price;
        bool isForsale;
        uint likes;
    }
       


    mapping(uint256 => Property) internal properties;
    
    
// Adding a new property
 
 function addProperty(
        string memory _url,
        string memory _description,
        string memory _location,
        uint _price
    ) public {
        uint _likes = 0;
        
        properties[propertiesLength] = Property(
            payable(msg.sender),
            _url,
            _description,
            _location,
            _price,
            true,
            _likes
        );
       
        propertiesLength++;
    }




    // get properties
    function getProperties(uint _index) public view returns (
        address payable,
        string memory, 
        string memory,
        string memory,
        uint,
        bool,
        uint
    ) {
        return (
            properties[_index].owner,
            properties[_index].url,
            properties[_index].description,
            properties[_index].location,
            properties[_index].price,
            properties[_index].isForsale,
            properties[_index].likes
        );
    }


// liking property and making sure owner cannot like their own property
    function likeProperty(uint _index) public {
        require(msg.sender != properties[_index].owner, "Owner of property cant like property");
        properties[_index].likes++;
    }
    
 

    // setting the property for sale and adding a check to make sure only the owner can make a product for sale
    function setForsale(uint _index) public{
        require(msg.sender == properties[_index].owner, "Only the owner of this property can run this operation");
        properties[_index].isForsale = !properties[_index].isForsale;
    }
// changing the price of the property and making sure only the owner of the property can change the price
    function changePrice(uint _index, uint _price) public {
        require(msg.sender == properties[_index].owner, "Only the owner of this property can run this operation");
        properties[_index].price = _price;
    }

// editing the details of the property and making sure only the owner of the property can edit it and also making sure the location cannot be change
    function editProperty(
        uint256 _index,
        string memory _url,
        string memory _description 
    ) public {
        require(msg.sender == properties[_index].owner, "Only owner can edit the property");// making sure only the owner of the property can edit the property
        string memory _location = properties[_index].location;
        uint _price = properties[_index].price;
        bool _isForsale = properties[_index].isForsale;
        uint _likes = properties[_index].likes;
        properties[_index] = Property(
            payable(msg.sender),
            _url,
            _description,
            _location,
            _price,
            _isForsale,
            _likes
        );
    }




    // buying a property and transfering ownership to the buyer and making sure the  property is actually for sale before carrying out the transaction 
    function BuyProperty(uint _index) public payable  {
        require(properties[_index].isForsale == true, "this property is not for sale");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            properties[_index].owner,
            properties[_index].price
          ),
          "Transfer failed."
        );
        properties[_index].owner = payable(msg.sender); // transfer of ownership of the property
    }



    /* this function calculate the appreciation of a
     property in a given ammount of years assuming 
     the annual appreciation rate is 50% 
     */
    function PropertyAppreciationCalculator(uint _numberOfyears, uint _initialWorth) public pure returns(uint) {
        uint appreciationValue = _initialWorth * 50;  // multiplying the initial worth by 50
        uint percentageIncrease = appreciationValue / 100; // dividing the appreciation value by 100 to get the actual 50 percent value increase
        uint v = percentageIncrease * _numberOfyears; // multiplying the gotten value with the number of years
        uint result = v + _initialWorth; // adding the percentage increase value to the initial worth to get the total worth in the given ammount of years
        return(result);
    }

    // return length of total properties
    function getpropertiesLength() public view returns (uint) {
        return (propertiesLength);
    }
  
}