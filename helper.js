const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const totalAmtToBePaid = (investment) => {
    return investment;
}

const getReturnAmount = (investment, stakeFactor) => {
  return investment * stakeFactor;
}

module.exports = {randomNumber, totalAmtToBePaid, getReturnAmount}