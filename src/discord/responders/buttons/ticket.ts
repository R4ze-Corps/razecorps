import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { createRow } from "@magicyan/discord";
import { 
    ButtonBuilder, 
    ButtonStyle, 
    ChannelType, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    TextChannel
} from "discord.js";
import * as discordTranscripts from "discord-html-transcripts";
import fs from "fs";
import path from "path";

// Painel Inicial e Lógica de Abertura
createResponder({
    customId: "ticket-open",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const { guild, user } = interaction;
        if (!guild) return;

        await interaction.deferReply({ ephemeral: true });
        const categoryId = "1322339427967828091";
        const existingChannel = guild.channels.cache.find(c => c.name === `⏰・${user.username.toLowerCase()}`);

        if (existingChannel) {
            await interaction.editReply({ content: `❌ Você já possui um atendimento aberto em ${existingChannel}!` });
            return;
        }

        try {
            const channel = await guild.channels.create({
                name: `⏰・${user.username}`,
                type: ChannelType.GuildText,
                parent: categoryId,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory] }
                ],
            });

            const embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setThumbnail("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/logo-png(1).png")
                .setTitle("🛒 Central de Atendimento - Raze Corporation")
                .setDescription(
                    `Olá ${user}! Bem-vindo(a) ao suporte da Raze Corporation.\n\n` +
                    "**Como solicitar um serviço:**\n" +
                    "1. Clique no menu de seleção logo abaixo e escolha o produto que você deseja.\n" +
                    "2. Após escolher, envie no chat todas as informações.\n" +
                    "3. Aguarde nossa equipe."
                )
                .addFields({ name: "👤 ASSUMIDO:", value: "`Ninguém`", inline: true })
                .setImage("https://r2.fivemanage.com/vLUsF9vzqBOo7DSFHERFX/Gemini_Generated_Image_nenl89nenl89nenl.png");

            const menuRow = createRow(
                new StringSelectMenuBuilder()
                    .setCustomId("ticket-select-service")
                    .setPlaceholder("📦 Selecione o produto que você deseja")
                    .addOptions([
                        { label: "Bot", value: "service-bot", emoji: "🤖" },
                        { label: "Roupas", value: "service-clothes", emoji: "👕" },
                        { label: "Script", value: "service-script", emoji: "📜" },
                    ])
            );

            const actionRow = createRow(
                new ButtonBuilder().setCustomId("ticket-assumir").setLabel("Assumir").setStyle(ButtonStyle.Success).setEmoji("✅"),
                new ButtonBuilder().setCustomId("botao_add_pessoa").setLabel("Adicionar").setStyle(ButtonStyle.Secondary).setEmoji("➕"),
                new ButtonBuilder().setCustomId("botao_remover_pessoa").setLabel("Remover").setStyle(ButtonStyle.Secondary).setEmoji("➖"),
                new ButtonBuilder().setCustomId("ticket-close").setLabel("Fechar").setStyle(ButtonStyle.Danger).setEmoji("🔒")
            );

            await channel.send({ content: `${user}`, embeds: [embed], components: [menuRow, actionRow] });
            await interaction.editReply({ content: `✅ Seu ticket foi criado em ${channel}!` });
        } catch (e) { await interaction.editReply({ content: "❌ Erro ao criar ticket." }); }
    },
});

// ABRIR MODAL ADICIONAR
createResponder({
    customId: "botao_add_pessoa",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("modal_add_id")
            .setTitle("Adicionar Membro ao Ticket");

        const inputId = new TextInputBuilder()
            .setCustomId("input_user_id")
            .setLabel("Qual o ID do Discord do usuário?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Ex: 123456789012345678")
            .setRequired(true)
            .setMinLength(17)
            .setMaxLength(19);

        modal.addComponents(createRow(inputId));
        await interaction.showModal(modal);
    },
});

// ABRIR MODAL REMOVER
createResponder({
    customId: "botao_remover_pessoa",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("modal_remove_id")
            .setTitle("Remover Membro do Ticket");

        const inputId = new TextInputBuilder()
            .setCustomId("input_user_id_remove")
            .setLabel("Qual o ID do Discord do usuário?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Ex: 123456789012345678")
            .setRequired(true)
            .setMinLength(17)
            .setMaxLength(19);

        modal.addComponents(createRow(inputId));
        await interaction.showModal(modal);
    },
});

// ASSUMIR E FECHAR (Otimizados)
createResponder({
    customId: "ticket-assumir",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const { message, user } = interaction;
        if (!message?.embeds[0]) return;
        const newEmbed = EmbedBuilder.from(message.embeds[0]);
        const fieldIdx = newEmbed.data.fields?.findIndex(f => f.name === "👤 ASSUMIDO:");
        if (fieldIdx !== undefined && fieldIdx !== -1) newEmbed.data.fields![fieldIdx].value = `${user}`;
        await interaction.update({ embeds: [newEmbed] });
    },
});

createResponder({
    customId: "ticket-close",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const { channel, guild, user } = interaction;
        if (!channel || channel.type !== ChannelType.GuildText) return;

        await interaction.reply({ content: "🔒 **Este ticket será fechado e o transcript gerado em 5 segundos...**" });

        setTimeout(async () => {
            try {
                // Carregar canal de logs da config
                const configPath = path.join(process.cwd(), "config.json");
                let logChannelId = null;
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
                    logChannelId = config.ticketLogChannelId;
                }

                const logChannel = logChannelId ? (guild?.channels.cache.get(logChannelId) as TextChannel) : null;

                // Gerar Transcript
                const attachment = await discordTranscripts.createTranscript(channel as any, {
                    limit: -1,
                    filename: `transcript-${channel.name}.html`,
                    saveImages: true,
                    poweredBy: false
                });

                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle("📑 Novo Transcript de Ticket")
                        .setColor("#2B2D31")
                        .addFields(
                            { name: "🎫 Canal:", value: `\`${channel.name}\``, inline: true },
                            { name: "👤 Fechado por:", value: `${user}`, inline: true },
                            { name: "📅 Data:", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                        )
                        .setTimestamp();

                    await logChannel.send({ embeds: [embed], files: [attachment] });
                }

                await channel.delete().catch(() => {});
            } catch (error) {
                console.error("Erro ao gerar transcript:", error);
                await channel.delete().catch(() => {});
            }
        }, 5000);
    },
});
