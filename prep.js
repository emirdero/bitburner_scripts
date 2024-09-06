/** @param {NS} ns **/
import { multiscan, is_prepped, hackable } from "utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    const full_list = multiscan(ns, 'home');
    const filtered_list = full_list.filter((target) => hackable(ns, target));
    // Sort the list by max money available in descending order
    const sorted_list = ns.args[0] ? [ns.args[0]] : filtered_list.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    for (const target of sorted_list) {
        if (!is_prepped(ns, target)) {
            prepareTarget(ns, target, full_list);
        }
    }
}

/** @param {import(".").NS } ns */
export function prepareTarget(ns, target, hosts) {
    const ram_per_thread = ns.getScriptRam('targeted-grow.js', 'home');
    // Total threads needed to grow the target server
    let { grow_threads, weaken_threads } = prepThreads(ns, target);
    const grow_ratio = grow_threads / (grow_threads + weaken_threads);
    const weaken_ratio = weaken_threads / (grow_threads + weaken_threads);
    // Distribute the threads across all servers
    for (const server of hosts) {
        const usable_RAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        const available_threads = Math.floor(usable_RAM / ram_per_thread);
        if (available_threads == 0) continue;
        // run as many threads as possible on the server, but don't exceed the total threads needed
        const gt = Math.min(Math.floor(grow_ratio * available_threads));
        const wt = Math.min(Math.floor(weaken_ratio * available_threads), weaken_threads);
        if (gt > 0) ns.exec('targeted-grow.js', server, gt, gt, 0, target);
        if (wt > 0) ns.exec('targeted-weaken.js', server, wt, wt, 0, target);
        // Update the remaining threads
        grow_threads -= gt;
        weaken_threads -= wt;
        if (grow_threads <= 0 && weaken_threads <= 0) break;
    }
}

/** @param {NS} ns **/
function prepThreads(ns, hack_target) {
    let grow_amount = ns.getServerMaxMoney(hack_target) / ns.getServerMoneyAvailable(hack_target);
    let grow_threads = Math.ceil(ns.growthAnalyze(hack_target, grow_amount));
    let grow_counter_balance = ns.growthAnalyzeSecurity(grow_threads) / 0.05;
    let weaken_to_min = (ns.getServerSecurityLevel(hack_target) - ns.getServerMinSecurityLevel(hack_target)) / 0.05;
    let weaken_threads = Math.ceil(grow_counter_balance + weaken_to_min);
    return { grow_threads, weaken_threads };
}
