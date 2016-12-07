var B = function() {};

B.prototype.percent = function(qt, total) {
    if (total === 0) {
        return undefined;
    }
    return ( qt/total ) * 100;
}

module.exports = new B();