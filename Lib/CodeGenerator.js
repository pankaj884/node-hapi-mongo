'use strict';

const generateRandomNumber = function(minNum, maxNum) {

    var randm = Math.random();

    return  randm*maxNum < minNum ?  Math.floor(minNum + randm*maxNum) : Math.floor(randm*maxNum)
}
exports.generateRandomNumber = generateRandomNumber;