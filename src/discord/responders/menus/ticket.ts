import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { EmbedBuilder } from "discord.js";

createResponder({
    customId: "ticket-select-service",
    types: [ResponderType.StringSelect],
    cache: "cached",
    async run(interaction) {
        const { values, user } = interaction;
        const selected = values[0];

        let title = "";
        let description = "";
        let color = "#2B2D31";

        switch (selected) {
            case "service-bot":
                title = "🤖 Solicitação de Bot Personalizado";
                description = `${user}, por favor, detalhe as funcionalidades desejadas:\n\n` +
                    "1. Quais comandos o bot deve ter?\n" +
                    "2. Qual o objetivo principal do sistema?\n" +
                    "3. Existe alguma integração específica?\n\n" +
                    "*Aguarde um atendente para dar continuidade.*";
                color = "#5865F2";
                break;
            case "service-clothes":
                title = "👕 Encomenda de Roupas Exclusivas";
                description = `${user}, para sua modelagem exclusiva, envie no chat:\n\n` +
                    "1. Imagens de referência.\n" +
                    "2. Logotipos ou estampas.\n" +
                    "3. Ideias de cores e estilo da modelagem.\n\n" +
                    "*Nossa equipe analisará os detalhes em breve.*";
                color = "#EB459E";
                break;
            case "service-script":
                title = "📜 Desenvolvimento de Script/Otimização";
                description = `${user}, explique como o script deve funcionar:\n\n` +
                    "1. Qual é a base do seu servidor?\n" +
                    "2. O que precisa ser criado do zero ou otimizado?\n" +
                    "3. Qual o problema atual que deseja resolver?\n\n" +
                    "*Um desenvolvedor será atribuído ao seu caso.*";
                color = "#FEE75C";
                break;
        }

        const embed = new EmbedBuilder()
            .setColor(color as any)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
});
