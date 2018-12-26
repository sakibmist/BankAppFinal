import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";
//import logo from './logo.svg';
import "./App.css";
import CreateAccountPage from "./CreateAccountPage";
import AccountIndexPage from "./AccountIndexPage";
import AccountOperationPage from "./AccountOperationPage";
import AllTransactionPage from "./AllTransactionPage";
import DetailAccountPage from "./DetailAccountPage";

class App extends Component {
  render() {
    return (
      <div className="offset-1 col-sm-10">
        <div className="container">
          <div className="card border minHeight">
            <div className="card-header border">
              <h2 style={{ textAlign: "center" }}>Header</h2>
            </div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-info border-circle">
               
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active navSpace">
                    <NavLink className="nav-link" to="/app">
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item navSpace">
                    <NavLink className="nav-link" to="/createAccount">
                      Create Account
                    </NavLink>
                  </li>
                  <li className="nav-item navSpace">
                    <NavLink className="nav-link" to="/accountOperationPage">
                      Account Transaction
                    </NavLink>
                  </li> 
                  <li className="nav-item navSpace">
                    <NavLink className="nav-link" to="/accountIndexPage">
                      All Accounts
                    </NavLink>
                  </li>
                  <li className="nav-item navSpace">
                    <NavLink className="nav-link" to="/allTransactionPage">
                      All Transactions
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="minHeight">
              <Route path="/createAccount" component={CreateAccountPage} />
              <Route path="/accountIndexPage" component={AccountIndexPage} />
              <Route
                path="/accountOperationPage"
                component={AccountOperationPage}
              />
              <Route
                path="/allTransactionPage"
                component={AllTransactionPage}
              />
              <Route
                path="/detailAccountPage/information/:id"
                component={DetailAccountPage}
              />
            </div>
            <div className="card-footer border">
              <h6 className="text-center">
                All rights are reserved by the authority.
              </h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
