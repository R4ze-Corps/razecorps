import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { EmbedBuilder } from "discord.js";

createResponder({
    customId: "ticket-select-service",
    types: [ResponderType.StringSelect],
    cache: "cached",
    async run(interaction) {
        const { values, user, channel, message } = interaction;
        if (!channel || !channel.isTextBased() || !("setParent" in channel)) return;

        const selected = values[0];
        let categoryId = "";
        let productName = "";

        switch (selected) {
            case "service-bot":
                categoryId = "1500064617219620895";
                productName = "BOT";
                break;
            case "service-clothes":
                categoryId = "1500064222795661413";
                productName = "ROUPAS";
                break;
            case "service-script":
                categoryId = "1500064877623119932";
                productName = "SCRIPT";
                break;
        }

        // Mover para a categoria correspondente
        await (channel as any).setParent(categoryId, { lockPermissions: false });

        // Atualizar o embed original para incluir o produto e remover o menu
        if (message && message.embeds[0]) {
            const oldEmbed = message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .addFields({ name: "📦 PRODUTO:", value: `\`${productName}\``, inline: true });

            await message.edit({
                embeds: [newEmbed],
                components: [message.components[1]] // Mantém apenas a linha de botões, remove o menu
            });
        }

        await interaction.reply({
            content: `✅ Você selecionou o serviço de **${productName}**! O ticket foi movido para a categoria correta.`,
            ephemeral: true
        });
    },
});
