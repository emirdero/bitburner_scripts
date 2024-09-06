/** @param {NS} ns */
export async function main(ns) {
    let upgrade_amount = 2 ** 2
    while (true) {
        const purchased_servers = ns.getPurchasedServers();
        let totalcost = 0
        for (const server of purchased_servers) {
            const cost = ns.getPurchasedServerUpgradeCost(server, upgrade_amount)
            totalcost = totalcost + cost;
            if (cost > 1) ns.upgradePurchasedServer(server, upgrade_amount)
        }
        if (totalcost < 0) {
            upgrade_amount = upgrade_amount * 2;
            if (upgrade_amount > 2 ** 20) return;
        } else {
            await ns.sleep(1000)
        }
    }
}