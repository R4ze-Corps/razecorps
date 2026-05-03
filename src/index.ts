import { env } from "#env";
import { bootstrap } from "@constatic/base";
import ck from "chalk";

console.log(ck.blue("? Projeto Raze II Iniciando..."));
console.log(ck.green("? Variáveis de ambiente validadas ?"));

await bootstrap({ 
    meta: import.meta, 
    env,
    clearConsole: false
});

console.log(ck.cyan("\n? Raze Corporation está online!"));
console.log(ck.yellow("? (M-1.0) Versão inicial do sistema de Ticket configurada."));
