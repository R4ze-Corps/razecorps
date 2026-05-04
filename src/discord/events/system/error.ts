import { createEvent } from "#base";
import ck from "chalk";

createEvent({
    name: "SystemError",
    event: "error",
    async run(error) {
        console.error(ck.redBright("❌ [ERRO NO DISCORD.JS]:"), error);
    }
});
