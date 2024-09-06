/** @param {NS} ns **/
export function multiscan(ns, server) {
	const visitedServers = new Set();
	const serverQueue = [server];
	while (serverQueue.length > 0) {
		// Get the next server in the queue
		const currentServer = serverQueue.shift();
		// Scan the current server and add any new servers to the queue
		ns.scan(currentServer).map(server => {
			if (!visitedServers.has(server)) {
				visitedServers.add(server);
				serverQueue.push(server);
			}
		});
	}
	return Array.from(visitedServers);
}

/** @param {NS} ns **/
export function gainRootAccess(ns, server) {
	ns.getServerMaxMoney
	let open_ports = 0;
	if (ns.fileExists('brutessh.exe')) {
		ns.brutessh(server);
		open_ports++;
	}
	if (ns.fileExists('ftpcrack.exe')) {
		ns.ftpcrack(server);
		open_ports++;
	}
	if (ns.fileExists('relaysmtp.exe')) {
		ns.relaysmtp(server);
		open_ports++;
	}
	if (ns.fileExists('httpworm.exe')) {
		ns.httpworm(server);
		open_ports++;
	}
	if (ns.fileExists('sqlinject.exe')) {
		ns.sqlinject(server);
		open_ports++;
	}
	if (ns.getServerNumPortsRequired(server) <= open_ports) {
		ns.tprint("Running Nuke.exe on " + server)
		ns.nuke(server);
		// Copy scripts to server
		ns.scp(['targeted-grow.js', 'targeted-hack.js', 'targeted-weaken.js'], server, "home");
	}
	/* Requires Singularity 4-1
	if (!serverData.backdoorInstalled) {
		ns.installBackdoor(server);
	}
	*/
}

// Check if server is at max money and min security
export const is_prepped = (ns, target) => ns.getServerMinSecurityLevel(target) == ns.getServerSecurityLevel(target) && ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target);

// Check if server is hackable (has money, root access, and is within hacking level)
export const hackable = (ns, target) => ns.getServerMaxMoney(target) > 0 && ns.hasRootAccess(target) && ns.getServerRequiredHackingLevel(target) < ns.getHackingLevel()

