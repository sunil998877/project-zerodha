import React from "react";
const Summary = () => {
  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings (13)</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              1.55k <small>+5.20%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>31.43k</span>{" "}
            </p>
            <p>
              Investment <span>29.88k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Account Access</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>Quick Actions</h3>
            <p>Manage your account</p>
          </div>
          <hr />

          <div className="second">
            <div className="action-buttons">
              <a 
                href="/signup" 
                className="signup-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Create New Account
              </a>
              <a 
                href="/dashboard" 
                className="dashboard-link"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};


export default Summary;