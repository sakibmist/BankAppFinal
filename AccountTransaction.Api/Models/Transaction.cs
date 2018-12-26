using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProjectApi.Models;

namespace AccountTransaction.Api.Models
{     public class Transaction
    {
        [Key]
        public long TransactionId { get; set; } 

        [Required]
        public decimal Balance { get; set; }

        [Required]
        public decimal Receive { get; set; }

        [Required]
        public decimal Payment { get; set; }

        [Required]
        public DateTime TxnDateTime { get; set; } = DateTime.Now;

        [Required]
        public long AccountId { get; set; }

        [ForeignKey("AccountId")]
        public virtual Account Account { get; set; }
    }
}