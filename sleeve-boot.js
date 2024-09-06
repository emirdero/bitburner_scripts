/** @param {NS} ns */
export async function main(ns) {
    const number_of_sleeves = ns.sleeve.getNumSleeves()
    for (let i = 0; i < number_of_sleeves; i++) {
        ns.sleeve.setToCommitCrime(i, "Rob Store")
        //ns.sleeve.setToUniversityCourse(i, "rothman university", "Algorithms")
    }
}