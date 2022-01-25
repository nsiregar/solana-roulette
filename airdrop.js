const web3 = require("@solana/web3.js");
const chalk = require("chalk");
const { getWalletBalance, airDropSol } = require("./solana")

const userSecretKey = [
  111, 110, 223, 91, 139, 1, 7, 176, 64, 74, 98,
  140, 130, 167, 137, 197, 159, 192, 225, 176, 252, 217,
  190, 137, 242, 19, 106, 19, 101, 112, 110, 212, 112,
  200, 186, 95, 121, 130, 6, 48, 122, 148, 220, 18,
  118, 55, 93, 87, 181, 114, 153, 68, 49, 64, 108,
  91, 77, 218, 14, 166, 37, 38, 185, 175,
]

const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey))

const airDropUser = async () => {
  console.log(chalk.green(`Airdropping wallet ${userWallet.publicKey.toString()}`));
  let balanceBefore = await getWalletBalance(userWallet.publicKey.toString());
  console.log(chalk.green(`Current Balance ${balanceBefore}`));
  await airDropSol(userWallet, 2);
  console.log(chalk.green('Airdropping .... '))
  let balanceAfter = await getWalletBalance(userWallet.publicKey.toString());
  console.log(chalk.green(`Current Balance ${balanceAfter}`));
};

airDropUser();