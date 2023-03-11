const findAGoodGridIndex = (maxNumber, selectedGrids) => {
    let randomNumber
    do {
        randomNumber = Math.floor(Math.random() * maxNumber);
        console.log(randomNumber);
    } while(selectedGrids.includes(randomNumber));
    
    return randomNumber;
}

module.exports = findAGoodGridIndex;