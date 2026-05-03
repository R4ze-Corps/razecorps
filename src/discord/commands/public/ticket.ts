import { createCommand } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

createCommand({
    name: "ticket",
    description: "Envia apenas o botão de atendimento",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const row = createRow(
            new ButtonBuilder()
                .setCustomId("ticket-open")
                .setLabel("Iniciar Atendimento")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📩")
        );

        await interaction.reply({
            content: "✅ Botão enviado com sucesso!",
            flags: ["Ephemeral"]
        });

        await interaction.channel?.send({
            components: [row]
        });
    }
});
