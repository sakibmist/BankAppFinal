using System;
using System.Linq;
using AccountTransaction.Api.Dto;
using AccountTransaction.Api.Models;
using Microsoft.AspNetCore.Mvc;
using ProjectApi.Models;

namespace ProjectApi.Controllers
{
    [Route("api/transactions")]
    [ApiController]

    public class TransactionsController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TransactionsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        //get all data without condition
        [HttpGet]
        public IActionResult GetAllData()
        {
            try
            {
                var transactionsData = _dataContext.Transactions
                    .Select(s => new TransactionReturnDto
                    {
                        Id = s.TransactionId,
                        AccountNo = s.Account.AccountNo,
                        Receive = s.Receive,
                        Payment = s.Payment,
                        Balance = s.Balance,
                        TxnDateTime = s.TxnDateTime,
                        AccountId = s.AccountId
                    })
                    .OrderByDescending(x => x.Id).ToList();
                return Ok(transactionsData); //200
            }
            catch (System.Exception)
            {
                return BadRequest(); //400
            }
        }

        // Get all data against one accountId To show at details in index page

        [HttpGet("accountid/{accountId}")]
        public IActionResult GetAllTransactionByAccountId(long accountId)
        {
            try
            {
                var listofTrn = _dataContext.Transactions
                    .Where(x => x.AccountId == accountId)
                    .Select(y => new TransactionReturnDto
                    {

                        AccountId = y.AccountId,
                            Receive = y.Receive,
                            Payment = y.Payment,
                            Balance = y.Balance,
                            TxnDateTime = y.TxnDateTime
                    }).OrderByDescending(x => x.TxnDateTime).ToList();
                return Ok(listofTrn); //200
            }
            catch (System.Exception)
            {
                return BadRequest(); //400
            }
        }

        //get all transaction data from all transaction  by one accountId and show in decending order against the id. 

        [HttpGet("account/id/{accountId}")]
        public IActionResult GetAllDataById(long accountId)
        {
            try
            {
                var listofTrn = _dataContext.Transactions
                    .Where(x => x.Account.Id == accountId)
                    .Select(s => new TransactionReturnDto
                    {
                        Id = s.TransactionId,
                            AccountNo = s.Account.AccountNo,
                            Receive = s.Receive,
                            Payment = s.Payment,
                            Balance = s.Balance,
                            TxnDateTime = s.TxnDateTime,
                            AccountId = s.AccountId
                    }).OrderByDescending(x => x.TxnDateTime).ToList(); //
                return Ok(listofTrn); //200
            }
            catch (System.Exception)
            {
                return BadRequest(); //400
            }
        } 
 
        // [HttpGet("account/number/{accountNo}")]
        // public IActionResult GetAllData(string accountNo)
        // {
        //     try
        //     {
        //         var listofData = _dataContext.Transactions
        //             .Where(x => x.Account.AccountNo.ToLower() == accountNo.ToLower())
        //             .Select(s => new TransactionReturnDto
        //             {
        //                 Id = s.TransactionId,
        //                     AccountNo = s.Account.AccountNo,
        //                     Balance = s.Balance,
        //                     TxnDateTime = s.TxnDateTime,
        //                     AccountId = s.AccountId
        //             }).ToList();
        //         return Ok(listofData); //200
        //     }
        //     catch (System.Exception)
        //     {
        //         return BadRequest(); //400
        //     }
        // }

        [HttpPost]
        public IActionResult AddTransaction(TransactionDto transactionDto)
        {
            using(var transaction = _dataContext.Database.BeginTransaction())
            {
                try
                {
                    var account = _dataContext.Accounts.FirstOrDefault(x => x.Id == transactionDto.AccountId);
                    if (account == null) return BadRequest("Account number is invalid");

                    // processing and calculations
                    switch (transactionDto.TransactionMode.ToLower())
                    {
                        case "dr":
                            if (transactionDto.Amount <= 0) return BadRequest("Invalid amount");
                            if (account.Balance < transactionDto.Amount) return BadRequest("Insufficient Balance");
                            account.Balance -= transactionDto.Amount;
                            account.UpdatedAt = DateTime.Now;
                            break;
                        case "cr":
                            if (transactionDto.Amount <= 0) return BadRequest("Invalid amount");
                            account.Balance += transactionDto.Amount;
                            account.UpdatedAt = DateTime.Now;
                            break;

                        default:
                            return BadRequest();
                    }

                    // adding transactions
                    var txn = new Transaction
                    {
                        AccountId = transactionDto.AccountId,
                        Balance = account.Balance,
                        Receive = transactionDto.TransactionMode == "dr" ? transactionDto.Amount : 0,
                        Payment = transactionDto.TransactionMode == "cr" ? transactionDto.Amount : 0
                    };
                    _dataContext.Transactions.Add(txn);
                    _dataContext.SaveChanges();

                    // updating account
                    _dataContext.Accounts.Update(account);
                    _dataContext.SaveChanges();

                    transaction.Commit();
                    return Ok(); //200
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(ex.Message);
                }
            }
        }
    }
}