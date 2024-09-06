// Description: This script will automatically upgrade your Hacknet Nodes to maximize your earnings.
/** @param {import(".").NS } ns */
export async function main(ns, maxNodes = ns.args[0] ?? 20) {
    while (true) {
        let allNodes = [];
        let nodes = ns.hacknet.numNodes();

        // Buy new node if we can afford it
        if (nodes < maxNodes) ns.hacknet.purchaseNode();

        // If there are no nodes, wait 1 sec and then start from the top
        if (nodes < 1) {
            await ns.sleep(1000)
            continue
        }

        // Get all nodes and their RoI
        for (let i = 0; i < nodes; i++) {
            const node = ns.hacknet.getNodeStats(i);
            const { costs, RoI } = calculateCostsAndRoI(ns, node, i);
            const topRoI = Math.max(...RoI);
            allNodes.push({
                index: i,
                level: node.level, // Add current level
                ram: node.ram, // Add current RAM
                cores: node.cores, // Add current cores
                best_upgrade: RoI.indexOf(topRoI),
                best_upgrade_cost: costs[RoI.indexOf(topRoI)], // Add best_upgrade_cost property
                RoI: topRoI,
            });
        }

        // Find the node with the best RoI
        const bestNode = allNodes.reduce((prev, curr) => prev.RoI > curr.RoI ? prev : curr);
        const bestNodeIndex = allNodes.indexOf(bestNode);
        let upgradeded = false;
        // Upgrade the best node
        switch (bestNode.best_upgrade) {
            case 0:
                upgradeded = ns.hacknet.upgradeLevel(bestNode.index, 1);
                break;
            case 1:
                upgradeded = ns.hacknet.upgradeRam(bestNode.index, 1);
                break;
            case 2:
                upgradeded = ns.hacknet.upgradeCore(bestNode.index, 1);
                break;
        }

        if (upgradeded) {
            const node = ns.hacknet.getNodeStats(bestNode.index);
            // Update RoI for the best node
            const { new_costs, RoI } = calculateCostsAndRoI(ns, node, bestNode.index);
            if (RoI && RoI.length > 0 && new_costs && new_costs.length > 0) {
                const topRoI = Math.max(...RoI);
                allNodes[bestNodeIndex] = {
                    ...allNodes[bestNodeIndex],
                    RoI: topRoI,
                    best_upgrade: RoI.indexOf(topRoI),
                    best_upgrade_cost: new_costs[RoI.indexOf(topRoI)],
                    level: node.level, // Update current level
                    ram: node.ram, // Update current RAM
                    cores: node.cores, // Update current cores
                };
            }
        }
        await ns.sleep(200);
    }
}

function calculateCostsAndRoI(ns, node, index) {
    const costs = [
        ns.hacknet.getLevelUpgradeCost(index, 1),
        ns.hacknet.getRamUpgradeCost(index, 1),
        ns.hacknet.getCoreUpgradeCost(index, 1)
    ];
    const { level, ram, cores } = node;
    const current_gain_rate = calculateMoneyGainRate(level, ram, cores)
    const RoI = [
        (calculateMoneyGainRate(level + 1, ram, cores) - current_gain_rate) / costs[0],
        (calculateMoneyGainRate(level, ram + 1, cores) - current_gain_rate) / costs[1],
        (calculateMoneyGainRate(level, ram, cores + 1) - current_gain_rate) / costs[2]
    ];
    return { costs, RoI };
}

function calculateMoneyGainRate(level, ram, cores) {
    const levelMult = level * 1.7;
    const ramMult = Math.pow(1.035, ram - 1);
    const coresMult = (cores + 5) / 6;
    return levelMult * ramMult * coresMult;
}
