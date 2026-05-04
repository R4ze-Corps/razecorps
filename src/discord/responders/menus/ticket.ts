import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { EmbedBuilder, ComponentType, ActionRow } from "discord.js";

createResponder({
    customId: "ticket-select-service",
    types: [ResponderType.StringSelect],
    cache: "cached",
    async run(interaction) {
        const { values, channel, message } = interaction;
        if (!channel || !channel.isTextBased() || !("setParent" in channel)) {
            await interaction.reply({ content: "❌ Este canal não suporta troca de categoria!", ephemeral: true });
            return;
        }

        await interaction.deferUpdate();

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
            default:
                return;
        }

        try {
            await (channel as any).setParent(categoryId, { lockPermissions: false });
        } catch (error) {
            console.error("Erro ao mudar categoria:", error);
        }

        if (message && message.embeds[0]) {
            const oldEmbed = message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed);
            
            const fields = Array.from(newEmbed.data.fields || []);
            const filteredFields = fields.filter(f => f.name !== "📦 PRODUTO:");
            newEmbed.setFields([...filteredFields, { name: "📦 PRODUTO:", value: `\`${productName}\``, inline: true }]);

            // Find the action row with buttons
            const actionRow = message.components.find(row => {
                const r = row as ActionRow<any>;
                return !r.components.some(c => 
                    c.type === ComponentType.StringSelect || 
                    c.type === ComponentType.UserSelect || 
                    c.type === ComponentType.RoleSelect || 
                    c.type === ComponentType.MentionableSelect || 
                    c.type === ComponentType.ChannelSelect
                );
            });

            await message.edit({
                embeds: [newEmbed],
                components: actionRow ? [actionRow.toJSON() as any] : []
            });
        }

        await interaction.followUp({
            content: `✅ Você selecionou o serviço de **${productName}**! O ticket foi movido para a categoria correta.`,
            ephemeral: true
        });
    },
});
