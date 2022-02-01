import React from 'react'
import { useState } from "react";


export const Properties = ( props ) => {
  const [newPrice, setnewPrice] = useState('');




    return (
      <div className="row">
        {props.propertiess.map((propertyy) => (
          <div className="col-4">
            <div className="card" key={propertyy.index}>
              <img
                className="card-img-top"
                src={propertyy.url}
                alt="Card image cap"
              />
              <div className="card-body">
                <h5 className="card-title">{propertyy.location}</h5>
                <h6 className="card-subtitle ">{propertyy.price} cUSD</h6>
                <p className="card-text">{propertyy.description}</p>
                <p className="card-text">
                  <small>
                    {propertyy.isForsale
                      ? "This Property is for sale"
                      : "This Property is not for sale"}
                  </small>
                </p>
                <div class="btn-group" role="group" aria-label="Basic example">
                  <button
                    onClick={() => props.buyProperty(propertyy.index)}
                    className="btn btn-primary"
                  >
                    Buy Property
                  </button>
                  <button
                    onClick={() => props.toggleForsale(propertyy.index)}
                    className="btn btn-dark"
                  >
                    {propertyy.isForsale ? "Set Not For Sale" : "Set for sale"}
                  </button>
                </div>
                <form>
                  <div class="form-row">
                    <input
                      type="text"
                      className="form-control"
                      value={newPrice}
                      onChange={(e) => setnewPrice(e.target.value)}
                      placeholder="new price"
                    />
                    <button
                      type="submit"
                      onClick={() => props.modifyPrice(propertyy.index, newPrice)}
                      className="btn btn-success"
                    >
                      Change Price
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      
        ))}
        ;
      </div>
    );
  };
  export default Properties;
      
       