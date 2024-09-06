/** @param {NS} ns */
export async function main(ns) {
    const number_of_sleeves = ns.sleeve.getNumSleeves()
    for (let i = 0; i < number_of_sleeves; i++) {
        const augment_pairs = ns.sleeve.getSleevePurchasableAugs(i)
        for (let j = 0; j < augment_pairs.length; j++) {
            const augment = augment_pairs[j].name
            ns.sleeve.purchaseSleeveAug(i, augment)
        }
    }
}