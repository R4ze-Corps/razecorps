import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { ChannelType, TextChannel } from "discord.js";

createResponder({
    customId: "modal_add_id",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction, _params): Promise<void> {
        await interaction.deferReply({ ephemeral: true });
        const { fields, guild, channel } = interaction;

        if (!guild || !channel || channel.type !== ChannelType.GuildText) {
            await interaction.editReply({ content: "❌ Este comando só pode ser usado em canais de texto de tickets." });
            return;
        }

        const userId = fields.getTextInputValue("input_user_id");

        try {
            const member = await guild.members.fetch(userId).catch(() => null);

            if (!member) {
                await interaction.editReply({ content: "❍ Usuário não encontrado no servidor! Verifique o ID." });
                return;
            }

            // Atualiza as permissões do usuário no canal atual (ticket aberto)
            await (channel as TextChannel).permissionOverwrites.create(member.id, {
                ViewChannel: true,
                SendMessages: true,
                AttachFiles: true,
                EmbedLinks: true,
                ReadMessageHistory: true
            });

            await interaction.editReply({ 
             content: `✅ O usuário ${member} foi adicionado a este ticket por <@${interaction.user.id}>.` 
            });
        } catch (error) {
            console.error("Erro ao adicionar membro:", error);
            await interaction.editReply({ content: "❌ Ocorreu um erro ao tentar adicionar o usuário ao ticket. Verifique as permissões do bot." });
        }
    }
});


createResponder({
    customId: "modal_remove_id",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction, _params): Promise<void> {
        await interaction.deferReply({ ephemeral: true });
        const { fields, guild, channel } = interaction;

        if (!guild || !channel || channel.type !== ChannelType.GuildText) {
            await interaction.editReply({ content: "❌ Este comando só pode ser usado em canais de texto de tickets." });
            return;
        }

        const userId = fields.getTextInputValue("input_user_id_remove");

        try {
            const member = await guild.members.fetch(userId).catch(() => null);

            if (!member) {
                await interaction.editReply({ content: "❍ Usuário não encontrado no servidor! Verifique o ID." });
                return;
            }

            // Remove as permissões específicas do membro no canal atual
            await (channel as TextChannel).permissionOverwrites.delete(member.id);

            await interaction.editReply({ 
                content: `✅ O usuário <@${userId}> foi removido deste ticket por <@${interaction.user.id}>.` 
            });
        } catch (error) {
            console.error("Erro ao remover membro:", error);
            await interaction.editReply({ content: "❌ Ocorreu um erro ao tentar remover o usuário do ticket. Verifique as permissões do bot." });
        }
    }
});
