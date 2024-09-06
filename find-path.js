/** @param {NS} ns */
export async function main(ns) {
    const t = ns.args[0], p = ["home"], r = [];
    const s = (h, a) => ns.scan(h).forEach(c => {
        if (!p.includes(c) && ns.hasRootAccess(c)) {
            p.push(c);
            if (c === t) { ns.tprint(`${a} -> ${h}`); return; };
            s(c, `${a} -> ${h}`);
        }
    });
    s("home", "");
}
