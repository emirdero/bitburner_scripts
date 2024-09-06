import { multiscan } from "utils.js";

/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0]
    const target_security = ns.getServerMinSecurityLevel(target) + 3
    const target_money = ns.getServerMaxMoney(target) * 3 / 4
    const hosts = multiscan(ns, 'home');
    while (true) {
        for (const host of hosts) {
            if (!ns.hasRootAccess(host)) continue;
            const ram_per_thread = ns.getScriptRam('targeted-weaken.js')
            const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ram_per_thread)
            if (threads == 0) continue;
            if (ns.getServerSecurityLevel(target) > target_security) {
                // If the server's security level is above our threshold, weaken it
                ns.exec('targeted-weaken.js', host, threads, threads, 0, target);
            } else if (ns.getServerMoneyAvailable(target) < target_money) {
                // Otherwise, if the server's money is less than our threshold, grow it
                ns.exec('targeted-grow.js', host, threads, threads, 0, target);
            } else {
                // Otherwise, hack it
                ns.exec('targeted-hack.js', host, threads, threads, 0, target);
            }
        }
        await ns.sleep(1000)
    }
}