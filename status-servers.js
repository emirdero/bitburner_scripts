import { multiscan } from "utils.js";

/** @param {import(".").NS } ns */
export async function main(ns) {
    const hosts = multiscan(ns, 'home');
    let sorted_servers = []
    for (const host of hosts) {
        // If the required hacking level is higher than the player's hacking level, skip
        if (ns.getServerRequiredHackingLevel(host) > ns.getHackingLevel()) continue;
        if (!ns.hasRootAccess(host)) continue;
        const available_money = ns.getServerMoneyAvailable(host)
        const moneyMax = ns.getServerMaxMoney(host)
        if (moneyMax == 0) continue;
        const money_ratio = Math.floor(available_money / moneyMax * 100) + "%"
        const security = ns.getServerSecurityLevel(host)
        const min_security = ns.getServerMinSecurityLevel(host)
        const weaken_time = ns.getWeakenTime(host);
        const roi = moneyMax / weaken_time
        // insert server into sorted array based on money max money
        let i = 0
        for (i = 0; i < sorted_servers.length; i++) {
            if (moneyMax < sorted_servers[i].moneyMax) break;
        }
        sorted_servers.splice(i, 0, { host, money_ratio, security, min_security, available_money, moneyMax, roi })
    }
    for (const server of sorted_servers) {
        // Add T for trill0000000.000000000ion, B for billion, M for million, K for thousand
        if (server.moneyMax >= 1e12) {
            server.moneyMax = (server.moneyMax / 1e12).toFixed(2) + "t"
            server.available_money = (server.available_money / 1e12).toFixed(2) + "t"
        } else if (server.moneyMax >= 1e9) {
            server.moneyMax = (server.moneyMax / 1e9).toFixed(2) + "b"
            server.available_money = (server.available_money / 1e9).toFixed(2) + "b"
        } else if (server.moneyMax >= 1e6) {
            server.moneyMax = (server.moneyMax / 1e6).toFixed(2) + "m"
            server.available_money = (server.available_money / 1e6).toFixed(2) + "m"
        } else if (server.moneyMax >= 1e3) {
            server.moneyMax = (server.moneyMax / 1e3).toFixed(2) + "k"
            server.available_money = (server.available_money / 1e3).toFixed(2) + "k"
        }
        ns.tprint(`${server.host} - ${server.money_ratio}`)
        ns.tprint(`Security: ${server.security}, Min security: ${server.min_security}`)
        ns.tprint(`Money: ${server.available_money}, Max money: ${server.moneyMax}, RoI: ${server.roi.toFixed(2)}`)
        ns.tprint("-------------------------------------------------")
    }
}