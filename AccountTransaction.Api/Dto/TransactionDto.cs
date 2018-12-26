namespace AccountTransaction.Api.Dto
{
    public class TransactionDto
    {
        public long AccountId { get; set; }
        public string TransactionMode { get; set; }
        public decimal Amount { get; set; }
    }
}