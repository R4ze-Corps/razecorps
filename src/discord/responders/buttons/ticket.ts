import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";

createResponder({
    customId: "ticket-open",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        // Lógica futura para abrir o canal de ticket
        await interaction.reply({
            flags: ["Ephemeral"],
            content: "⌛ Iniciando seu atendimento...",
        });
    },
});