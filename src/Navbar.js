import React from 'react'


const Navbar = (props) => {
    return (
          <nav className="d-flex justify-content-between pt-2 pb-5">
            <h1 className="brand-name">Realtor</h1>

            <span> <li><a className="balance"><span>{props.cUSDBalance}</span>cUSD</a></li>
            </span>
            </nav>
    
    );
  };
  
  export default Navbar;