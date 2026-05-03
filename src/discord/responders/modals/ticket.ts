import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";

createResponder({
    customId: "ticket-add-user-action",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction) {
        const { fields, guild, channel } = interaction;
        if (!guild || !channel || !("permissionOverwrites" in channel)) return;

        const userId = fields.getTextInputValue("user-id");

        try {
            const member = await guild.members.fetch(userId);
            if (!member) {
                await interaction.reply({ content: "❌ Usuário não encontrado no servidor!", ephemeral: true });
                return;
            }

            await (channel as any).permissionOverwrites.create(member.id, {
                ViewChannel: true,
                SendMessages: true,
                AttachFiles: true,
                EmbedLinks: true
            });

            await interaction.reply({ content: `✅ ${member} foi adicionado ao ticket!` });

        } catch (error) {
            await interaction.reply({ content: "❌ ID inválido ou erro ao adicionar usuário.", ephemeral: true });
        }
    },
});
