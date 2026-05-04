import { env } from "#env";
import { bootstrap } from "@constatic/base";
import ck from "chalk";
import fs from "node:fs";

console.clear();
console.log(ck.blue("★ Projeto Raze II - Inicializando..."));

process.on('uncaughtException', (error) => {
    console.error(ck.redBright("🔥 [ERRO GLOBAL] Exceção não tratada:"), error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(ck.redBright("⚠️ [ERRO GLOBAL] Promessa rejeitada não tratada:"), reason, promise);
});
	await bootstrap({ 
    meta: import.meta, 
    env
});

console.log(ck.green("☰ Variáveis de ambiente validadas ✓"));
console.log(ck.cyan("{/} Comando Slash > /ticket ✓"));
console.log(ck.magenta("▸ Botão > ticket-open ✓"));

console.log(ck.green("\n◎ Raze Corporation está online e pronta!"));

if (fs.existsSync("Changlogs.txt")) {
    const logs = fs.readFileSync("Changlogs.txt", "utf-8");
    console.log(ck.yellow("\n★ CHANGELOGS"));
    console.log(ck.white(logs));
}
