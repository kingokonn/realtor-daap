import React from 'react'

import { useState } from "react";

export const NewProperty = (props) => {


 const [url, setUrl] = useState('');
 const [description, setDescription] = useState('');
 const [location, setLocation] = useState('');
 const [price, setPrice] = useState('');

 const submitHandler = (e) => {
  e.preventDefault();

  if(!url || !description || !location || !price) {
    alert('Please fill all fields')
    return
  }
  props.addProperty(url, description, location, price);

  setUrl('')
  setDescription('')
  setLocation('')
  setPrice('')
};




    return (
<>
<div className='mb-2'>
<form onSubmit={submitHandler} >
  <div className="form-group">
    <input type="text"
           className="form-control"
           value={url}
           onChange={(e) => setUrl(e.target.value)}
           placeholder="image url" />
  </div>
  <div className="form-group">
    <input type="text"
           className="form-control"
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           placeholder="description"/>
  </div>


  <div className="form-group">
  
    <input type="text" 
           className="form-control"
           value={location}
           onChange={(e) => setLocation(e.target.value)}
           placeholder="location" />
  </div>

  <div className="form-group">

    <input type="text"
           className="form-control"
           value={price}
           onChange={(e) => setPrice(e.target.value)}
           placeholder="price"/>
  </div>
  <button type="submit" class="btn btn-primary">Add property</button>
</form>
</div>
  </>      
           
    )
}
export default NewProperty;