/**
 *
 * @param playRoom
 * @constructor
 */
function LinkController(playRoom) {
    this.playRoom = playRoom;
}

/**
 * main link controller routine
 */
LinkController.prototype.run = function() {
    this.playRoom.linkCollection.forEach(function(link) {
        if (link.cooldown > 0 || link.energy <= 0) {
            return;
        }

        if (!Memory.linkHandling.sourceLinkCollection[link.id]) {
            return;
        }

        for (var targetLinkId in Memory.linkHandling.targetLinkCollection) {
            var targetLink = Game.getObjectById(targetLinkId)
            if (!targetLink
                || Memory.linkHandling.targetLinkCollection[targetLinkId] != link.id
                || (targetLink.energy > (targetLink.energyCapacity / 2))) {
                continue;
            }

            link.transferEnergy(targetLink);
        }
    });
};

module.exports = LinkController;
