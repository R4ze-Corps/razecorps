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
    TextInputStyle
} from "discord.js";

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
                    },
                    { name: "👤 ASSUMIDO:", value: "`Ninguém`", inline: true }
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
                    .setCustomId("ticket-assumir")
                    .setLabel("Assumir")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                new ButtonBuilder()
                    .setCustomId("ticket-add-user-modal")
                    .setLabel("Adicionar")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("➕"),
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

createResponder({
    customId: "ticket-assumir",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const { message, user } = interaction;
        if (!message || !message.embeds[0]) return;

        const oldEmbed = message.embeds[0];
        const newEmbed = EmbedBuilder.from(oldEmbed);
        
        const assumidoFieldIndex = newEmbed.data.fields?.findIndex(f => f.name === "👤 ASSUMIDO:");
        if (assumidoFieldIndex !== undefined && assumidoFieldIndex !== -1) {
            newEmbed.data.fields![assumidoFieldIndex].value = `${user}`;
        } else {
            newEmbed.addFields({ name: "👤 ASSUMIDO:", value: `${user}`, inline: true });
        }

        await interaction.update({ embeds: [newEmbed] });
    },
});

createResponder({
    customId: "ticket-add-user-modal",
    types: [ResponderType.Button],
    cache: "cached",
    async run(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("ticket-add-user-action")
            .setTitle("Adicionar Pessoa ao Ticket");

        const userIdInput = new TextInputBuilder()
            .setCustomId("user-id")
            .setLabel("ID do Usuário")
            .setPlaceholder("Digite o ID do Discord da pessoa")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row = createRow(userIdInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    },
});

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
