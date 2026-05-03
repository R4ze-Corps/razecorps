import { createCommand } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

createCommand({
    name: "ticket",
    description: "Envia o painel de atendimento (Ticket)",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const bannerEmbed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setImage("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/Gemini_Generated_Image_giolfxgiolfxgiol(1).png");

        const contentEmbed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setTitle("📝 Sistema de Ticket - 🔨 Warn Nuis")
            .setDescription(
                "**▶️ ATENÇÃO!**\n" +
                "Não abra um **ATENDIMENTO** sem ter algo relevante. Leia nossas <#1301323386001719369>, abrir apenas por abrir irá gerar punições.\n\n" +
                "──────────────────────────────────────────"
            );

        const row = createRow(
            new ButtonBuilder()
                .setCustomId("ticket-open")
                .setLabel("Iniciar Atendimento")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("➕")
        );

        await interaction.reply({
            content: "✅ Painel enviado com sucesso!",
            flags: ["Ephemeral"]
        });

        await interaction.channel?.send({
            embeds: [bannerEmbed, contentEmbed],
            components: [row]
        });
    }
});
