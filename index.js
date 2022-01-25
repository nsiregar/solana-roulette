const web3 = require("@solana/web3.js");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");

const { getReturnAmount, totalAmtToBePaid, randomNumber } = require('./helper');
const { getWalletBalance, transferSOL, airDropSol } = require("./solana");

const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

// const userPublicKey = [
//   112, 200, 186, 95, 121, 130, 6, 48,
//   122, 148, 220, 18, 118, 55, 93, 87,
//   181, 114, 153, 68, 49, 64, 108, 91,
//   77, 218, 14, 166, 37, 38, 185, 175,
// ]

const userSecretKey = [
  111, 110, 223, 91, 139, 1, 7, 176, 64, 74, 98,
  140, 130, 167, 137, 197, 159, 192, 225, 176, 252, 217,
  190, 137, 242, 19, 106, 19, 101, 112, 110, 212, 112,
  200, 186, 95, 121, 130, 6, 48, 122, 148, 220, 18,
  118, 55, 93, 87, 181, 114, 153, 68, 49, 64, 108,
  91, 77, 218, 14, 166, 37, 38, 185, 175,
]

// const treasuryPublicKey = [
//   162, 254, 88, 196, 183, 122, 4, 110,
//   203, 139, 51, 0, 213, 140, 77, 14,
//   31, 223, 89, 85, 89, 145, 201, 185,
//   130, 5, 215, 139, 197, 37, 169, 187
// ]

const treasurySecretKey = [
  163, 219, 52, 165, 241, 182, 236, 49, 72, 107, 185,
  61, 228, 180, 219, 110, 105, 161, 12, 83, 158, 18,
  170, 168, 127, 39, 156, 145, 70, 238, 215, 248, 162,
  254, 88, 196, 183, 122, 4, 110, 203, 139, 51, 0,
  213, 140, 77, 14, 31, 223, 89, 85, 89, 145, 201,
  185, 130, 5, 215, 139, 197, 37, 169, 187
]

// generate wallet with generate_wallet.js
const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey))
const treasuryWallet = web3.Keypair.fromSecretKey(Uint8Array.from(treasurySecretKey))

const initBanner = () => {
    console.log(
        chalk.green(
            figlet.textSync("SOL Stake", {
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
    console.log(chalk.yellow(`The max bidding amount is 2.5 SOL`));
};

const initGame = () => {
  const questions = [
    {
      name: "SOL",
      type: "number",
      message: "What is the amount of SOL you want to stake?",
    },
    {
      type: "rawlist",
      name: "RATIO",
      message: "What is the ratio of your staking?",
      choices: ["1:1.25", "1:1.5", "1.75", "1:2"],
      filter: function (val) {
        const stakeFactor = val.split(":")[1];
        return stakeFactor;
      },
    },
    {
      type: "number",
      name: "RANDOM",
      message: "Guess a random number from 1 to 5 (both 1, 5 included)",
      when: async (val) => {
        if (parseFloat(totalAmtToBePaid(val.SOL)) > 5) {
          console.log(chalk.red`You have violated the max stake limit. Stake with smaller amount.`)
          return false;
        } else {
          console.log(`You need to pay ${chalk.green`${totalAmtToBePaid(val.SOL)}`} to move forward`)
          const userBalance = await getWalletBalance(userWallet.publicKey.toString())
          if (userBalance < totalAmtToBePaid(val.SOL)) {
            console.log(chalk.red`You don't have enough balance in your wallet`);
            return false;
          } else {
            console.log(chalk.green`You will get ${getReturnAmount(val.SOL, parseFloat(val.RATIO))} if guessing the number correctly`)
            return true;
          }
        }
      },
    }
  ];
  return inquirer.prompt(questions);
};

const gameExecution = async () => {
  initBanner();
  const generateRandomNumber = randomNumber(1, 5);
  const answers = await initGame();
  if (answers.RANDOM) {
    const paymentSignature = await transferSOL(userWallet, treasuryWallet, totalAmtToBePaid(answers.SOL))
    console.log(`Signature of payment for playing the game`, chalk.green`${paymentSignature}`);

    if (answers.RANDOM === generateRandomNumber) {

      await airDropSol(treasuryWallet, getReturnAmount(answers.SOL, parseFloat(answers.RATIO)));

      const prizeSignature = await transferSOL(
        treasuryWallet,
        userWallet,
        getReturnAmount(answers.SOL, parseFloat(answers.RATIO))
      );

      console.log(chalk.green`Your guess is absolutely correct`);
      console.log(`Here is the price signature `, chalk.green`${prizeSignature}`);

    } else {
      console.log(chalk.yellowBright`Better luck next time`);
    }
  }
};

gameExecution();