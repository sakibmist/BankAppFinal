using System;

namespace AccountTransaction.Api.Dto
{
    public class TransactionReturnDto
    { 
        public long Id { get; set; }  
        public decimal Receive { get; set; } 
        public decimal Payment { get; set; } 
        public DateTime TxnDateTime { get; set; } 
        public decimal Balance {get; set;}
        public string AccountNo { get; set; } 
        public long AccountId { get; set; }   

    }
}