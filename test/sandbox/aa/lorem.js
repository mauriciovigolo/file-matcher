var Lorem = function() {};

/**
 * Say Ipsum!
 *
 * @param sayIpsum
 */
Lorem.prototype.sayIpsum = function(sayIpsum) {
    console.log('Lorem ' + sayIpsum);
}

module.exports = new Lorem();