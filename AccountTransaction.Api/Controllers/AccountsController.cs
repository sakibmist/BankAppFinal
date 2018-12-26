using System;
using System.Linq;
using AccountTransaction.Api.Models;
using Microsoft.AspNetCore.Mvc;
using ProjectApi.Models;

namespace ProjectApi.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public AccountsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAllData()
        {
            try
            {
                var accounts = _dataContext.Accounts.OrderByDescending(x => x.Id).ToList();
                return Ok(accounts); //200
            }
            catch (System.Exception)
            {
                return BadRequest(); //400
            }
        }

        [HttpGet("{id}", Name = "GetData")]
        public IActionResult GetDataById(int id)
        {
            try
            {
                var data = _dataContext.Accounts.FirstOrDefault(x => x.Id == id);
                return Ok(data); //200
            }
            catch (System.Exception)
            {

                return BadRequest(); //400
            }
        }

        [HttpGet("check/account/{accountNo}")]
        public IActionResult CheckIsAccountNoExists(string accountNo)
        {
            try
            {
                var isExist = _dataContext.Accounts.Any(x => x.AccountNo.ToLower() == accountNo.ToLower());
                return Ok(new { IsExist = isExist }); //200 core er property kore neoya hoyese.
            }
            catch (System.Exception)
            {

                return BadRequest(); //400
            }
        }

        [HttpGet("check/balance/{accountId}/{amount}")]
        public IActionResult CheckAmount(long accountId, decimal amount)
        {
            try
            {
                var isInsufficient = true;
                var account = _dataContext.Accounts.Find(accountId);
                if (account == null) return NotFound("Account is not found");
                if (account.Balance < amount) isInsufficient = true;
                else isInsufficient = false;

                return Ok(new { IsInsufficient = isInsufficient });

            }
            catch (System.Exception)
            {
                return BadRequest(); //400
            }
        }

        //check valid account
        [HttpGet("check/valid/{accountNo}")]
        public IActionResult CheckValidAccount(string accountNo)
        {
            try
            {
                var account = _dataContext.Accounts.FirstOrDefault(s => s.AccountNo.ToLower() == accountNo.ToLower());
                if (account == null) return Ok(new { IsValidAccountNo = false });
                return Ok(new { IsValidAccountNo = true, AccountId = account.Id });
            }
            catch (Exception)
            {
                return Ok(new { IsValidAccountNo = false });
            }
        }

        [HttpPost]
        public IActionResult AddData(Account account)
        {
            using(var transaction = _dataContext.Database.BeginTransaction())
            {
                try
                {
                    if (account == null) return NotFound(); //404
                    _dataContext.Accounts.Add(account);
                    _dataContext.SaveChanges();

                    var firstTrn = new Transaction
                    {
                        AccountId = account.Id,
                        Balance = account.Balance,
                        Receive = 0,
                        Payment = account.Balance,
                        TxnDateTime = account.CreatedAt
                    };
                    _dataContext.Transactions.Add(firstTrn);
                    _dataContext.SaveChanges();

                    transaction.Commit();
                    return CreatedAtRoute("GetData", new { id = account.Id }, account); //201
                }
                catch (System.Exception)
                {
                    transaction.Rollback();
                    return BadRequest();
                }
            }

        }

    }
}