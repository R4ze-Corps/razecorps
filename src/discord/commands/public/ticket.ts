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
                "<:Construcao:1500525871965016064> **Sistema de Atendimento - Raze Corporation**\n\n" +
                "<:Ideia:1500526811879182426> **ATENÇÃO!**\n" +
                "Não abra um **ATENDIMENTO** sem ter algo relevante. Leia nossas [Termos & Condições](https://discord.com/channels/1320994106536759377/1321202554885115924)."
            )
            .setImage("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/Gemini_Generated_Image_giolfxgiolfxgiol(1).png");

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
