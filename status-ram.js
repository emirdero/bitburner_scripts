/** @param {NS} ns */
export async function main(ns) {
    const hosts = ns.scan()
    for (const host of hosts) {
        if (host.includes("pserv")) {
            ns.tprint(host + ": " + ns.getServerMaxRam(host))
        }
    }
}