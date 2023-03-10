const submitGrid = (grids) => {
    let message = 'Voici vos citations :\n';

    for(let i = 0; i < grids.length; i++) message += grids[i] + "\n";
    
    return message;
}

module.exports = submitGrid;