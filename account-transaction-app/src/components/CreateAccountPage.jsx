import React from 'react';
import http from 'axios';

class CreateAccountPage extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    middleName:'',
    accountNo: '',
    balance: '',
    cellNo: '',
    email: '',
    isAccountExist: undefined,
    isMobileValid: undefined,
    isEmailValid: undefined,
    isValidBalance: undefined
    
  };

  baseUrl = 'http://localhost:5000/api/accounts';

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleChangeCellNo = event => {
    const { value } = event.target;
    const pattern = /^\+?(?:[0-9]●?){10,14}[0-9]$/g;
    const isMobileValid = pattern.test(value);
    this.setState({
      cellNo: value,
      isMobileValid
    });
  };
  // handleChangeBalance = () => {
  //   const { balance} = this.state;
  //   const isValidBalance = balance <= 0 ? false : true;
  //   this.setState({isValidBalance});
  // };

  handleChangeEmail = event => {
    const { value } = event.target;
    const pattern = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/g;
    const isEmailValid = pattern.test(value);
    console.log(isEmailValid);
    this.setState({
      email: value,
      isEmailValid
    });
  };

  handleValidBalace = () => {
    const { balance } = this.state;
    if (balance <= 0) return false;
    return true;
  };

  handleValidateForm = () => {
    const { isEmailValid, isMobileValid, isAccountExist } = this.state;
    if (!isEmailValid || !isMobileValid || isAccountExist) return false;
    return true;
  };

  handleRequiredFields = () => {
    const { firstName, lastName, cellNo, email, balance } = this.state;
    if (!firstName || !lastName || !cellNo || !balance || !email)
      return false;
    return true;
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.handleRequiredFields()) {
      alert('Empty Fields are Required! Try again.');
      return;
    }
    if (!this.handleValidateForm()) {
      alert('Invalid Data Are Not Allowed. Try Again.');
      return;
    }
    if (!this.handleValidBalace()) {
      alert('Invalid Balance Is Not Allowed,Try Again. Enter balance > 0');
      return;
    }

    const {
      firstName,
      middleName,
      lastName,
      cellNo,
      email,
      balance,
      accountNo
    } = this.state;

     
    const data = { firstName, lastName, accountNo, cellNo, email,middleName, balance };
    const response = await http.post(this.baseUrl, data);
    console.log(response.data);
    if (response.status === 201) {
      this.props.history.push('/accountIndexPage');
    }
  };

  handleIsAccountExist = async () => {
    const { accountNo } = this.state;
    if (!accountNo) return;
    const response = await http.get(
      `${this.baseUrl}/check/account/${accountNo}`
    );
    if (response.status === 200) {
      const { isExist: isAccountExist } = response.data;
      this.setState({ isAccountExist });
    }
  }; 

  render() {
    const {
      firstName,
      lastName,
      middleName,
      cellNo,
      email,
      accountNo,
      balance,
      isEmailValid,
      isMobileValid,
      isAccountExist
    } = this.state;
    
    return (
      <div className="card-body border minHeight">
        <div className="offset-2 col-sm-8">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <label htmlFor="firstName" className="col-sm-4 col-form-label">
                First Name<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  placeholder="FirstName"
                  onChange={this.handleChange}
                />
              </div>
            </div> 
            <div className="form-group row">
              <label htmlFor="lastName" className="col-sm-4 col-form-label">
                Last Name<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  placeholder="LastName"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="firstName" className="col-sm-4 col-form-label">
                Middle Name
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="middleName"
                  name="middleName"
                  value={middleName}
                  placeholder="Middle Name"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="cellNo" className="col-sm-4 col-form-label">
                Mobile No.<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="cellNo"
                  name="cellNo"
                  value={cellNo}
                  placeholder=""
                  onBlur={this.handleExistcellNo}
                  onChange={this.handleChangeCellNo}
                />
                 
                {isMobileValid === false && (
                  <span className="text-danger">
                    Invalid Mobile No. (like-01****79339)
                  </span>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="cellNo" className="col-sm-4 col-form-label">
                Email<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  placeholder=""
                  onChange={this.handleChangeEmail}
                />
                {isEmailValid === false && (
                  <span className="text-danger">
                    Invalid Email.(Ex - name@gmail.com)
                  </span>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="accountNo" className="col-sm-4 col-form-label">
                A/C No.<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="accountNo"
                  name="accountNo"
                  value={accountNo}
                  placeholder=" A/C No."
                  onBlur={this.handleIsAccountExist}
                  onChange={this.handleChange}
                />
                {isAccountExist && (
                  <span className="text-danger">
                    Account Number is already exist!
                  </span>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="balance" className="col-sm-4 col-form-label">
                Balance<span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  id="balance"
                  name="balance"
                  value={balance}
                  placeholder="Balance"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-4" />
              <div className="col-sm-8">
                <button
                  className="btn  btn-primary"
                  type="submit"
                  disabled={isAccountExist}
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default CreateAccountPage;
