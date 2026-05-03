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

createResponder({
    customId: "ticket-open",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const { guild, user } = interaction;
        if (!guild) return;

        await interaction.deferReply({ ephemeral: true });

        // Categoria configurada
        const categoryId = "1322339427967828091";

        // Verificar se já existe um ticket aberto para evitar lag/spam
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
            // Criar o canal de ticket
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

            // Embed de Boas-vindas dentro do Ticket
            const embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setThumbnail("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/logo-png(1).png")
                .setTitle("Fluxo de Atendimento - Raze Corporation")
                .setDescription(
                    `Olá ${user}, bem-vindo(a) à sua sala de atendimento!\n\n` +
                    "**Como registrar seu farm:**\n" +
                    "1️⃣ Selecione na lista abaixo o produto que você farmou.\n" +
                    "2️⃣ Preencha a quantidade na janela que vai abrir.\n" +
                    "3️⃣ Envie o print da entrega no chat e finalize.\n\n" +
                    "Acompanhe seu progresso clicando em \"Ver Entregas\"."
                )
                .addFields(
                    { name: "🎯 Metas de Farm:", value: 
                        "📦 **Plástico Black:** Meta 500\n" +
                        "📦 **Alumínio:** Meta 500\n" +
                        "📦 **Pólvora Preta:** Meta 1.000\n" +
                        "📦 **Barra de Ferro:** Meta 1.000\n" +
                        "📦 **Cartão SD:** Meta 500"
                    }
                )
                .setImage("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/Gemini_Generated_Image_nenl89nenl89nenl.png");

            // Menu de Seleção
            const menuRow = createRow(
                new StringSelectMenuBuilder()
                    .setCustomId("ticket-select-service")
                    .setPlaceholder("📦 Selecione o produto que você farmou")
                    .addOptions([
                        { label: "Bot", value: "service-bot", emoji: "🤖", description: "Sistemas personalizados e bots de Discord" },
                        { label: "Roupas", value: "service-clothes", emoji: "👕", description: "Modelagens e texturas exclusivas" },
                        { label: "Script", value: "service-script", emoji: "📜", description: "Scripts para FiveM e otimizações" },
                    ])
            );

            // Botões de Ação
            const actionRow = createRow(
                new ButtonBuilder()
                    .setCustomId("ticket-view-orders")
                    .setLabel("Ver Entregas")
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
import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

// Botão Ver Entregas
createResponder({
    customId: "ticket-view-orders",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        // Futuramente buscar do banco de dados
        await interaction.reply({
            content: "📊 **Resumo de Entregas:**\n\nNo momento, você não possui pedidos finalizados ou em andamento no nosso sistema.",
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
