import React from 'react';
import http from 'axios';

class AccountOperationPage extends React.Component {
  state = {
    accountId: '',
    accountNo: '',
    transactionMode: '',
    amount: '',
    listofaccount: [],
    isInsufficientBalance: undefined,
    isValidAccountNo: undefined
  };

  baseUrl = 'http://localhost:5000/api';

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    //console.log(this.state);
  };

  handleAccountNoValid = async () => {
    const { accountNo } = this.state;
    if (!accountNo) return;
    const response = await http.get(
      `${this.baseUrl}/accounts/check/valid/${accountNo}`
    );
    if (response.status === 200) {
      const { isValidAccountNo, accountId } = response.data;
      this.setState({
        isValidAccountNo,
        accountId
      });
    }
  };

  handleChangeAmount = event => {
    const { value } = event.target;
    this.setState({ amount: value, isInsufficientBalance: undefined });
  };

  handleChangeAccountNo = event => {
    const { value } = event.target;
    this.setState({
      accountNo: value,
      isValidAccountNo: undefined });

    console.log(this.state.accountNo,this.state.isValidAccountNo);
  };

  handleInsufficiectAmount = async () => {
    const { accountId, amount, transactionMode } = this.state;

    if (!accountId || !amount) return;
    if (transactionMode === 'cr') return;
    const response = await http.get(
      `${this.baseUrl}/accounts/check/balance/${accountId}/${amount}`
    );
    if (response.status === 200) {
      console.log(response.data);
      const { isInsufficient: isInsufficientBalance } = response.data;
      this.setState({ isInsufficientBalance });
    }
  };

  handleRequiredFields = () => {
    const { accountId, amount, transactionMode } = this.state;
    if (!accountId || !transactionMode || !amount) return false;
    return true;
  };

  handleValidAmount = () => {
    const { amount } = this.state;
    if (amount <= 0) return false;
    return true;
  };

  handleSubmit = async event => {
    event.preventDefault();
    const {
      accountId,
      amount,
      transactionMode,
      isInsufficientBalance
    } = this.state;
    if (!this.handleRequiredFields()) {
      alert('Empty Fields are Required!');
      return;
    }
    if (isInsufficientBalance) {
      alert('Invalid Data are not Allowed!');
      return;
    }
    if (!this.handleValidAmount()) {
      alert('Invalid Amount! Enter amount > 0');
      return;
    }
    if (amount <= 0) return;
    if (isInsufficientBalance) return;
    const response = await http.post(`${this.baseUrl}/transactions`, {
      accountId,
      transactionMode,
      amount
    });

    if (response.status === 200) {
      console.log(response.status);
      this.props.history.push('/allTransactionPage');
    }
  };

  render() {
    const {
      accountNo,
      amount,
      transactionMode,
      isInsufficientBalance,
      isValidAccountNo
    } = this.state;

    return (
      <div className="card-body border minHeight">
        <div className="offset-2 col-sm-8">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <label htmlFor="accountNo" className="col-sm-4 col-form-label">
                A/C No.<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  name="accountNo"
                  id="accountNo"
                  value={accountNo}
                  className="form-control"
                  onBlur={this.handleAccountNoValid}
                  onChange={this.handleChangeAccountNo}
                />
                {isValidAccountNo === false && (
                  <span className="text-danger">
                    Account Number is not Valid! Try again
                  </span>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="lname" className="col-sm-4 col-form-label">
                Transaction Mode<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <select
                  name="transactionMode"
                  id="transactionMode"
                  className="form-control"
                  value={transactionMode}
                  onChange={this.handleChange}
                  disabled={!isValidAccountNo}
                >
                  <option>--Select--</option>
                  <option value="dr">Receive</option>
                  <option value="cr">Payment</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="amount" className="col-sm-4 col-form-label">
                Amount<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  name="amount"
                  value={amount}
                  placeholder=""
                  onBlur={this.handleInsufficiectAmount}
                  onChange={this.handleChangeAmount}
                  disabled={!isValidAccountNo}
                />
                {isInsufficientBalance && (
                  <span className="text-danger">Insufficient Balance!</span>
                )}
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-4" />
              <div className="col-sm-8">
                <button
                  className="btn  btn-primary"
                  type="submit"
                  disabled={isInsufficientBalance || !isValidAccountNo}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default AccountOperationPage;
