import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";

createResponder({
    customId: "modal_add_id",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction, _params): Promise<void> {
        const { fields, guild, channel } = interaction;
        
        if (!guild || !channel || !("permissionOverwrites" in channel)) {
            return;
        }

        const userId = fields.getTextInputValue("input_user_id");

        try {
            const member = await guild.members.fetch(userId).catch(() => null);

            if (!member) {
                await interaction.reply({ content: "❌ Usuário não encontrado no servidor!", ephemeral: true });
                return;
            }

            await (channel as any).permissionOverwrites.create(member.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });

            await interaction.reply({ 
                content: `✅ O usuário <@${userId}> foi adicionado a este ticket por <@${interaction.user.id}>.` 
            });
            return;

        } catch (error) {
            return;
        }
    },
});

createResponder({
    customId: "modal_remove_id",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction, _params): Promise<void> {
        const { fields, guild, channel } = interaction;
        
        if (!guild || !channel || !("permissionOverwrites" in channel)) {
            return;
        }

        const userId = fields.getTextInputValue("input_user_id_remove");

        try {
            const member = await guild.members.fetch(userId).catch(() => null);

            if (!member) {
                await interaction.reply({ content: "❌ Usuário não encontrado no servidor!", ephemeral: true });
                return;
            }

            await (channel as any).permissionOverwrites.delete(member.id);

            await interaction.reply({ 
                content: `✅ O usuário <@${userId}> foi removido deste ticket por <@${interaction.user.id}>.` 
            });
            return;

        } catch (error) {
            return;
        }
    },
});
