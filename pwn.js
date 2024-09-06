/** @param {NS} ns **/
import { multiscan, is_prepped, hackable } from "utils.js";
import { prepareTarget } from "prep.js";

/*
function best_target(ns) {
    const hosts = multiscan(ns, 'home');
    const targets = hosts.filter((target) => hackable(ns, target));
    let best_target = "n00dles";
    let best_roi = 0;
    for (const target of targets) {
        // If the target is not prepped, skip
        if (!is_prepped(ns, target)) continue;
        const roi = ns.getServerMaxMoney(target) / ns.getWeakenTime(target);
        if (roi > best_roi) {
            best_roi = roi;
            best_target = target;
        }
    }
    ns.tprint(`Best target: ${best_target}`);
    return best_target;
}
*/

/** @param {import(".").NS } ns */
export async function main(ns) {
    // If target is not specified, set it to best target
    let target = ns.args[0] //?? best_target(ns);
    // If reserved ram is not specified, set it to 10GB
    const reserved_RAM = ns.args[1] ?? 10
    while (true) {
        const hosts = multiscan(ns, 'home');
        if (!is_prepped(ns, target)) {
            // Return target to max money and min security
            prepareTarget(ns, target, hosts);
            await ns.sleep(ns.getWeakenTime(target) + 1000)
        }
        else {
            // Execute hacks on the host servers
            await executeHacks(ns, target, hosts, reserved_RAM);
        }
    }
}
/** @param {NS} ns **/
async function executeHacks(ns, hack_target, hosts, reserved_RAM) {
    // Calculate the weaken, grow, and hack times for the hack target
    const weaken_time = ns.getWeakenTime(hack_target);
    const delay_increment = 1;
    const hack_delay = Math.floor(weaken_time - ns.getHackTime(hack_target));
    const grow_delay = Math.floor(weaken_time - ns.getGrowTime(hack_target)) + 2 * delay_increment;
    let running_delay = 0
    const ram_per_thread = ns.getScriptRam('targeted-grow.js', 'home');
    // determines threads needed for grow hack and weaken to maintain optimal profit
    const { hack_threads, weaken1_threads, grow_threads, weaken2_threads } = HackBatchThreads(ns, hack_target);
    const total_threads = hack_threads + grow_threads + weaken1_threads + weaken2_threads;
    // sanity check
    if (weaken1_threads == 0 || weaken2_threads == 0 || grow_threads == 0 || hack_threads == 0) return;
    // Loop through host servers
    for (const server of hosts) {
        // Determines needed RAM for a cycle of grow weaken hack with determined threads
        let usable_RAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        const available_threads = Math.floor(usable_RAM / ram_per_thread);
        if (server == "home") usable_RAM -= reserved_RAM;
        // Execute weaken, grow, and hack scripts on server
        const iterations = Math.floor(available_threads / total_threads);
        //ns.tprint(`Executing ${iterations} iterations on ${server} total threads ${total_threads} `);
        for (let i = 0; i < Math.min(iterations, 10000); i++) {
            ns.exec('targeted-hack.js', server, hack_threads, hack_threads, hack_delay + running_delay, hack_target);
            ns.exec('targeted-weaken.js', server, weaken1_threads, weaken1_threads, delay_increment + running_delay, hack_target);
            ns.exec('targeted-grow.js', server, grow_threads, grow_threads, grow_delay + running_delay, hack_target);
            ns.exec('targeted-weaken.js', server, weaken2_threads, weaken2_threads, delay_increment * 3 + running_delay, hack_target);
            running_delay += 4 * delay_increment
        }
    }
    // Fill rest of the ram with some weaken and grow that runs on the end to prep the server for a new batch
    for (const server of hosts) {
        // Add grow and weaken scripts to the server
        let usable_RAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        // If the server is home, reserve some RAM for other scripts
        if (server == "home") usable_RAM -= reserved_RAM;
        const available_threads = Math.floor(usable_RAM / ram_per_thread);
        const grow_threads = Math.floor(available_threads / 2);
        const weaken_threads = Math.ceil(available_threads / 2);
        if (grow_threads > 0) ns.exec('targeted-grow.js', server, grow_threads, grow_threads, grow_delay + running_delay + 100, hack_target);
        if (weaken_threads > 0) ns.exec('targeted-weaken.js', server, weaken_threads, weaken_threads, running_delay + 200, hack_target);
    }
    // Wait for the attack to finish with 2 seconds of margin
    await ns.sleep(weaken_time + running_delay + 2000)
    return;
}
/** @param {NS} ns **/
function HackBatchThreads(ns, hack_target) {
    const hack_percent = 1 / 4

    let hack_money = ns.getServerMaxMoney(hack_target) * hack_percent;
    let hack_threads = Math.floor(ns.hackAnalyzeThreads(hack_target, hack_money));
    // add margin to grow and weaken as margin for error
    const margin = 1.1
    let grow_threads = Math.ceil(margin * ns.growthAnalyze(hack_target, 1 / (1 - hack_percent)));
    let hack_security_change = margin * ns.hackAnalyzeSecurity(hack_threads);
    let grow_security_change = margin * ns.growthAnalyzeSecurity(grow_threads);
    let weaken1_threads = Math.ceil(hack_security_change / 0.05);
    let weaken2_threads = Math.ceil(grow_security_change / 0.05);
    // Increase weaken threads if they are too low
    while (ns.weakenAnalyze(weaken1_threads) < hack_security_change) weaken1_threads += 5;
    while (ns.weakenAnalyze(weaken2_threads) < grow_security_change) weaken2_threads += 5;
    return { hack_threads, weaken1_threads, grow_threads, weaken2_threads };
}
