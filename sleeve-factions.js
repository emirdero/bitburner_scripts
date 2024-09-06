/** @param {NS} ns */
export async function main(ns) {
    const exluded = [] //["CyberSec", "Tian Di Hui", "Netburners", "NiteSec", "The Black Hand"]
    const factions = ns.getPlayer().factions.filter(name => !exluded.includes(name))
    for (let i = 0; i < factions.length; i++) ns.sleeve.setToFactionWork(i, factions[i], "hacking")
}