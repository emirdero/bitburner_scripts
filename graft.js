/** @param {import(".").NS } ns */
export async function main(ns) {
    const augments = ns.grafting.getGraftableAugmentations()
    // Sort augments by price in descending order
    const sorted_augments = augments.sort((a, b) => ns.grafting.getAugmentationGraftPrice(b) - ns.grafting.getAugmentationGraftPrice(a))
    for (let augment of sorted_augments) {
        const cost = ns.grafting.getAugmentationGraftPrice(augment)
        const current_money = ns.getServerMoneyAvailable("home")
        if (cost < current_money) {
            ns.grafting.graftAugmentation(augment)
            await ns.grafting.waitForOngoingGrafting()
        }
    }
}