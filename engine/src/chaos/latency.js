function shouldDelay( probability = 0.2) {
    return Math.random() < probability;
}

function applyLatency( min = 200, max = 1000 ){
    const delay = min + Math.random() * ( max - min);
    
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

module.exports = { shouldDelay, applyLatency };