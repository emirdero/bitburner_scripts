import { multiscan } from "utils.js";
/** @param {NS} ns */
export async function main(ns) {
    // List all servers
    ns.tprint(multiscan(ns, "home"))
}