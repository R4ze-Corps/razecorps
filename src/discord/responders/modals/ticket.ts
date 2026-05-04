import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";

createResponder({
    customId: "modal_add_id",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction, _params): Promise<void> {
        const { fields, guild, channel } = interaction;
        
        if (!guild || !channel || !("permissionOverwrites" in channel)) {
            await interaction.reply({ content: "❌ Este canal não suporta permissões!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const userId = fields.getTextInputValue("input_user_id");

        try {
            const member = await guild.members.fetch(userId).catch(() => null);

            if (!member) {
                await interaction.editReply({ content: "❌ Usuário não encontrado no servidor!" });
                return;
            }

            await (channel as any).permissionOverwrites.create(member.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true
            });

            await interaction.editReply({ 
                content: `✅ O usuário ${member} foi adicionado a este ticket por <@${interaction.user.id}>.` 
            });

            await (channel as any).send({
                content: `👋 ${member}, você foi adicionado a este ticket por <@${interaction.user.id}>.`
            });

        } catch (error) {
            console.error("Erro ao adicionar membro:", error);
            await interaction.editReply({ content: "❌ Ocorreu um erro ao adicionar o usuário. Verifique se eu tenho as permissões necessárias." });
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
            await interaction.reply({ content: "❌ Este canal não suporta permissões!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const userId = fields.getTextInputValue("input_user_id_remove");

        try {
            const member = await guild.members.fetch(userId).catch(() => null);

            if (!member) {
                await interaction.editReply({ content: "❌ Usuário não encontrado no servidor!" });
                return;
            }

            await (channel as any).permissionOverwrites.delete(member.id);

            await interaction.editReply({ 
                content: `✅ O usuário <@${userId}> foi removido deste ticket por <@${interaction.user.id}>.` 
            });

            await (channel as any).send({
                content: `🚫 O usuário <@${userId}> foi removido deste ticket.`
            });

        } catch (error) {
            console.error("Erro ao remover membro:", error);
            await interaction.editReply({ content: "❌ Ocorreu um erro ao remover o usuário. Verifique se eu tenho as permissões necessárias." });
        }
    },
});
