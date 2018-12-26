using Microsoft.EntityFrameworkCore;
using ProjectApi.Models;

namespace AccountTransaction.Api.Models
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Account>().HasIndex(p => p.AccountNo)
                .IsUnique(true);
        }

    }
}