/** @param {NS} ns **/
function calcBestRam(ns, numServers) {
	const availableMoneyPerServer = ns.getServerMoneyAvailable('home') / numServers;
	let ram = 2;
	for (let i = 2; i < 20; i++) {
		let result = Math.pow(2, i);
		const price = ns.getPurchasedServerCost(result);
		if (price > availableMoneyPerServer) {
			return ram;
		} else {
			ram = result;
		}
	}
	return ram;
}

/** @param {NS} ns **/
export async function main(ns, numServers = ns.args[0]) {
	const ram = calcBestRam(ns, numServers);
	const hosts = ns.scan("home");
	// Count all the servers that include the string 'pserv-'
	let pserv_count = hosts.filter(server => server.includes('pserv-')).length;

	if ((pserv_count + numServers) > ns.getPurchasedServerLimit()) {
		ns.tprint('You are trying to buy more servers than the limit allows.');
	} else {
		for (let i = 0; i < numServers; i++) {
			if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
				const name = 'pserv-' + pserv_count + i;
				ns.purchaseServer(name, ram)
				ns.scp(['targeted-grow.js', 'targeted-hack.js', 'targeted-weaken.js'], name, "home");
			}
		}
	}
}