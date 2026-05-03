import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";

createResponder({
    customId: "modal_add_id",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction) {
        const { fields, guild, channel } = interaction;
        if (!guild || !channel || !("permissionOverwrites" in channel)) return;

        const userId = fields.getTextInputValue("input_user_id");

        try {
            const member = await guild.members.fetch(userId);

            if (!member) {
                await interaction.reply({ content: "❌ Usuário não encontrado no servidor!", ephemeral: true });
                return;
            }

            await (channel as any).permissionOverwrites.create(userId, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });

            await interaction.reply({ 
                content: `✅ O usuário <@${userId}> foi adicionado a este ticket por <@${interaction.user.id}>.` 
            });

        } catch (error) {
            await interaction.reply({ 
                content: "❌ Ocorreu um erro. Verifique se o ID está correto e se a pessoa está no servidor.", 
                ephemeral: true 
            });
        }
    },
});
