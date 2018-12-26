import React from "react";
import http from "axios";
import moment from 'moment';
import {NavLink} from 'react-router-dom';

class AllTransactionsPage extends React.Component {
  state = {
    listofTransactions: []
  };

  baseUrl = "http://localhost:5000/api/transactions";

  async componentDidMount() {
    const response = await http.get(`${this.baseUrl}`); 
    if (response.status === 200) {
      const listofTransactions = response.data;
      console.log(listofTransactions);
      this.setState({ listofTransactions });
    }
  }

  render() {
    const { listofTransactions } = this.state;
    return (
      <div className="card-body border minHeight">
         
        <div className="d-flex justify-content-end mb-2">
          <NavLink to="/accountOperationPage" className="btn btn-info">
            Go back
          </NavLink>
        </div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
            <th>#</th> 
              <th>A/C No.</th>
              <th>Payment</th>
              <th>Receive</th>
              <th>Balance</th>
              <th>Transaction At</th>
            </tr>
          </thead>
          <tbody>
            {listofTransactions.map((transaction, index) => (
              <tr key={index}>
              <td>{index+1}</td>
                <td>{transaction.accountNo}</td>
                <td>{transaction.payment}</td>
                <td>{transaction.receive}</td>
                <td>{transaction.balance}</td>
                <td>{moment(transaction.txnDateTime).format("DD-MM-YYYY hh:mm:ss a")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default AllTransactionsPage;