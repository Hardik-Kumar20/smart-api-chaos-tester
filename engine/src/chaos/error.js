function shouldFail( probability = 0.1 ) {
    return Math.random() < probability;
}

module.exports = { shouldFail };    