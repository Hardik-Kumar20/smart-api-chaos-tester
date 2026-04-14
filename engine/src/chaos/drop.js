function shouldDrop( probability = 0.05) {
    return Math.random() < probability;
}

module.exports = { shouldDrop };