import { createCommand } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

createCommand({
    name: "ticket",
    description: "Envia o painel de atendimento (Ticket)",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription(
                "** SISTEMA DE ATENDIMENTO**\n\n" +
                "<:Construcao:1500546101630079117> **ATENÇÃO!**\n" +
                "Não abra um **ATENDIMENTO** sem ter algo relevante. Leia nossas https://discord.com/channels/1320994106536759377/1321202554885115924."
            )
            .setImage("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/Gemini_Generated_Image_nenl89nenl89nenl.png");

        const row = createRow(
            new ButtonBuilder()
                .setCustomId("ticket-open")
                .setLabel("Iniciar Atendimento")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📩")
        );

        await interaction.reply({
            content: "✅ Painel enviado com sucesso!",
            flags: ["Ephemeral"]
        });

        await interaction.channel?.send({
            embeds: [embed],
            components: [row]
        });
    }
});
