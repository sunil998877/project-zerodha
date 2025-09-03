import React from 'react';

function Pricing() {
    return ( 
       <div className="container">
        <div className="row align-items-center">
          
          {/* Left Section */}
          <div className="col-6">
              <h1 className="fs-2">Unbeatable pricing</h1>
              <p>
                We pioneered the concept of discount broking and price transparency in India. 
                Flat fees and no hidden charges.
              </p>
              <div>
                  <a href="">
                    See Pricing <i className="fa-solid fa-arrow-right"></i>
                  </a>
              </div>
          </div>

          {/* Spacer Column */}
          {/* <div className="col-2"></div> */}

          {/* Right Section */}
          <div className="col-6">
              <div className="row mb-5">
                  <div className="col text-center p-2 border">
                      <h1 className="mb-3" style={{color:"orange"}}>₹0</h1>
                      <p>Free account <br /> opening</p>
                  </div>
                  <div className="col text-center p-2 border">
                    <h1 className="mb-3" style={{color:"orange"}}>₹0</h1>
                    <p>Free equity delivery <br />
                    and direct mutual funds</p>
                  </div>
                  <div className="col text-center p-2 border">
                      <h1 className="mb-3" style={{color:"orange"}}>₹20</h1>
                      <p>Intraday and <br /> F&O</p>
                  </div>
              </div>
          </div>
        </div>
       </div>
     );
}

export default Pricing;