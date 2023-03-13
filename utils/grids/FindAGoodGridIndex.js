const findAGoodGridIndex = (maxNumber, selectedGrids) => {
    let randomNumber
    do {
        randomNumber = Math.floor(Math.random() * maxNumber);
    } while(selectedGrids.includes(randomNumber));
    
    return randomNumber;
}

module.exports = findAGoodGridIndex;