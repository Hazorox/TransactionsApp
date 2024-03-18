import Transaction from "../models/transaction.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = context.getUser()._id;
        const transactions = await Transaction.find({ user: userId });
        return transactions;
      } catch (err) {
        console.error("Error getting Transactions: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error getting Transaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating Transaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    updateTransaction: async (_, { input }, _) => {
      try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating Transaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findOneAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting Transaction: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};
export default transactionResolver;
