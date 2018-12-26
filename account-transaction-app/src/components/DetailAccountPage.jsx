import React from "react";
import http from "axios";
import { NavLink } from "react-router-dom";
import moment from "moment";

class DetailAccountPage extends React.Component {
  state = {
    account: {
      firstName: "",
      lastName: "",
      middleName:"",
      accountNo: "",
      balance: "",
      createdAt: "",
      updatedAt: ""
    },
    lisofTrns: []
  };

  baseUrl = "http://localhost:5000/api";

  async componentDidMount() {
    const { params } = this.props.match;
    if (!params || !params.id) {
      this.props.history.goBack();
      return;
    }
    const id = params.id;

    let response = await http.get(`${this.baseUrl}/accounts/${id}`); //get by id
    if (response.status === 200) {
      const account = response.data;
      this.setState({ account });
    } else {
      this.props.history.goBack();
      return;
    }

    response = await http.get(`${this.baseUrl}/transactions/accountid/${id}`);
    if (response.status === 200) {
      const lisofTrns = response.data;
      console.log(lisofTrns);
      this.setState({ lisofTrns });
    }
  } 

  render() {
    const { account, lisofTrns } = this.state;
    return (
      <div className="card-body border minHeight">
        <div className="d-flex justify-content-end mb-2">
          <NavLink to="/accountIndexPage" className="btn btn-info">
            Go back
          </NavLink>
        </div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{`${account.firstName} ${account.middleName} ${account.lastName}`}</td>
            </tr>
            <tr>
              <td>Account No.</td>
              <td>{account.accountNo}</td>
            </tr>
            <tr>
              <td>Current Balance</td>
              <td>{account.balance}</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>
                {moment(account.createdAt).format("DD-MM-YYYY hh:mm:ss a")}
              </td>
            </tr>
            <tr>
              <td>Updated At</td>
              <td>
                {moment(account.updatedAt).format("DD-MM-YYYY hh:mm:ss a")}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card border">
          <div className="card-header"> 
              All transactions of account no: <label style={{color:'maroon',font:'25px',fontFamily:'Verdana'}}>{account.accountNo}</label>             
          </div>
          <div className="card-body border">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>#</td> 
                  <td>Payment(cr)</td>
                  <td>Receive(dr)</td>
                  <td>Current Balance</td>
                  <td>Transaction Date</td>
                </tr>
                {lisofTrns.map((transaction, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{transaction.payment}</td>
                    <td>{transaction.receive}</td>
                    <td>{transaction.balance}</td>
                    <td>
                      {moment(transaction.txnDateTime).format(
                        "DD-MM-YYYY hh:mm:ss a"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default DetailAccountPage;
