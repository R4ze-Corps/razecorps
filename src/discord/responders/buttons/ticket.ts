import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { createRow } from "@magicyan/discord";
import { 
    ButtonBuilder, 
    ButtonStyle, 
    ChannelType, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    StringSelectMenuBuilder 
} from "discord.js";

// Botão para Abrir o Ticket
createResponder({
    customId: "ticket-open",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const { guild, user } = interaction;
        if (!guild) return;

        await interaction.deferReply({ ephemeral: true });

        const categoryId = "1322339427967828091";

        const existingChannel = guild.channels.cache.find(c => 
            c.name === `⏰・${user.username.toLowerCase()}`
        );

        if (existingChannel) {
            await interaction.editReply({
                content: `❌ Você já possui um atendimento aberto em ${existingChannel}!`
            });
            return;
        }

        try {
            const channel = await guild.channels.create({
                name: `⏰・${user.username}`,
                type: ChannelType.GuildText,
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel, 
                            PermissionFlagsBits.SendMessages, 
                            PermissionFlagsBits.AttachFiles, 
                            PermissionFlagsBits.EmbedLinks
                        ],
                    }
                ],
            });

            const embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setThumbnail("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/logo-png(1).png")
                .setTitle("🛒 Central de Atendimento - Raze Corporation")
                .setDescription(
                    `Olá ${user}! Bem-vindo(a) ao suporte da Raze Corporation. Estamos prontos para tirar suas dúvidas e iniciar o seu projeto.\n\n` +
                    "**Como solicitar um serviço:**\n" +
                    "1. Clique no menu de seleção logo abaixo e escolha o produto que você deseja.\n" +
                    "2. Após escolher, envie no chat todas as informações, ideias ou imagens de referência do que você precisa.\n" +
                    "3. Aguarde um momento! Nossa equipe já foi notificada e logo um atendente virá falar com você."
                )
                .addFields(
                    { name: "🎯 O que nós oferecemos:", value: 
                        "🤖 **Bot:** Desenvolvimento de sistemas e comandos personalizados para o seu Discord.\n" +
                        "👕 **Roupas:** Criação de texturas exclusivas sob medida.\n" +
                        "📜 **Script:** Sistemas exclusivos para a sua base."
                    }
                )
                .setImage("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/Gemini_Generated_Image_nenl89nenl89nenl.png");

            const menuRow = createRow(
                new StringSelectMenuBuilder()
                    .setCustomId("ticket-select-service")
                    .setPlaceholder("📦 Selecione o produto que você deseja")
                    .addOptions([
                        { label: "Bot", value: "service-bot", emoji: "🤖", description: "Sistemas personalizados e bots de Discord" },
                        { label: "Roupas", value: "service-clothes", emoji: "👕", description: "Modelagens e texturas exclusivas" },
                        { label: "Script", value: "service-script", emoji: "📜", description: "Scripts para FiveM e otimizações" },
                    ])
            );

            const actionRow = createRow(
                new ButtonBuilder()
                    .setCustomId("ticket-view-orders")
                    .setLabel("Ver Pedidos")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("📊"),
                new ButtonBuilder()
                    .setCustomId("ticket-config")
                    .setLabel("Configurar")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("⚙️"),
                new ButtonBuilder()
                    .setCustomId("ticket-close")
                    .setLabel("Fechar")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🔒")
            );

            await channel.send({
                content: `${user}`,
                embeds: [embed],
                components: [menuRow, actionRow]
            });

            await interaction.editReply({
                content: `✅ Seu ticket foi criado com sucesso em ${channel}!`
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: "❌ Ocorreu um erro ao tentar criar o seu ticket. Verifique minhas permissões!"
            });
        }
    },
});

// Botão Ver Pedidos
createResponder({
    customId: "ticket-view-orders",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        await interaction.reply({
            content: "📊 **Resumo de Pedidos:**\n\nNo momento, você não possui pedidos finalizados ou em andamento no nosso sistema.",
            flags: ["Ephemeral"]
        });
    },
});

// Botão Configurar (Apenas Admins)
createResponder({
    customId: "ticket-config",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: "❌ Apenas administradores podem configurar o sistema!",
                flags: ["Ephemeral"]
            });
            return;
        }

        await interaction.reply({
            content: "⚙️ **Painel de Configuração:**\nEm breve você poderá editar textos e serviços diretamente por aqui.",
            flags: ["Ephemeral"]
        });
    },
});

// Botão Fechar
createResponder({
    customId: "ticket-close",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        await interaction.reply({
            content: "🔒 **Este ticket será fechado em 5 segundos...**"
        });

        setTimeout(async () => {
            try {
                await interaction.channel?.delete();
            } catch (error) {
                console.error("Erro ao deletar canal:", error);
            }
        }, 5000);
    },
});
