const web3 = require("@solana/web3.js");

const airDropSol = async (wallet, amount) => {
  try {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    const fromAirDropSignature = await connection.requestAirdrop(
      new web3.PublicKey(wallet.publicKey.toString()),
      amount * web3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    console.log(err);
  }
};

const getWalletBalance = async (publicKey) => {
  try {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    const walletBalance = await connection.getBalance(new web3.PublicKey(publicKey));
    return walletBalance / web3.LAMPORTS_PER_SOL;
  } catch (err) {
    console.log(err);
  }
};

const transferSOL = async (from, to, amount) => {
  try {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: new web3.PublicKey(from.publicKey.toString()),
        toPubkey: new web3.PublicKey(to.publicKey.toString()),
        lamports: amount * web3.LAMPORTS_PER_SOL
      })
    );
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
    );
    return signature;
  } catch (err) {
    console.log(err)
  }
};

module.exports = {airDropSol, getWalletBalance, transferSOL}