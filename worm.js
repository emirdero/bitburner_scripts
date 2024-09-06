// Worm.js
import { multiscan, gainRootAccess } from "utils.js";

/** @param {NS} ns */
export async function main(ns) {
    let hosts = multiscan(ns, 'home');
    hosts.forEach(host => {
        if (!ns.hasRootAccess(host)) {
            gainRootAccess(ns, host);
        }
    });
}
