import { env } from "#env";
import { bootstrap } from "@constatic/base";
import ck from "chalk";
import fs from "node:fs";

// Limpa o console manualmente já que a propriedade não existe no framework
console.clear();

console.log(ck.blue("? Projeto Raze II - Inicializando..."));

await bootstrap({ 
    meta: import.meta, 
    env
});

// Customização do log em PT-BR
console.log(ck.green("? Variáveis de ambiente validadas ?"));
console.log(ck.cyan("{/} Comando Slash > /ticket ?"));
console.log(ck.magenta("? Botão > ticket-open ?"));

console.log(ck.green("\n? Raze Corporation está online e pronta!"));

// Exibir Changelogs no terminal
if (fs.existsSync("Changlogs.txt")) {
    const logs = fs.readFileSync("Changlogs.txt", "utf-8");
    console.log(ck.yellow("\n? CHANGELOGS"));
    console.log(ck.white(logs));
}
