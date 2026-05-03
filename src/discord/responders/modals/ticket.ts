import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";

createResponder({
    customId: "ticket-add-user-action",
    types: [ResponderType.Modal],
    cache: "cached",
    async run(interaction) {
        const { fields, guild, channel } = interaction;
        if (!guild || !channel || !("permissionOverwrites" in channel)) return;

        // Adia a resposta para evitar o erro de "Algo deu errado" (timeout)
        await interaction.deferReply({ ephemeral: true });

        const userId = fields.getTextInputValue("user-id");

        // Verifica se o ID é apenas números para evitar erros básicos
        if (!/^\d+$/.test(userId)) {
            await interaction.editReply({ content: "❌ Por favor, insira um ID de usuário válido (apenas números)." });
            return;
        }

        try {
            // Tenta adicionar a permissão diretamente pelo ID (mais rápido e otimizado)
            await (channel as any).permissionOverwrites.create(userId, {
                ViewChannel: true,
                SendMessages: true,
                AttachFiles: true,
                EmbedLinks: true
            });

            await interaction.editReply({ content: `✅ O usuário com ID **${userId}** foi adicionado ao ticket com sucesso!` });

        } catch (error) {
            console.error("Erro ao adicionar usuário ao ticket:", error);
            await interaction.editReply({ 
                content: "❌ Não foi possível adicionar o usuário. Verifique se o ID está correto ou se eu tenho permissão de Administrador." 
            });
        }
    },
});
