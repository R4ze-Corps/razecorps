import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";
import fs from "fs";
import path from "path";

createCommand({
    name: "config",
    description: "Configura o sistema de Ticket",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    options: [
        {
            name: "logs",
            description: "Configura o canal de logs/transcripts",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    description: "Selecione o canal de texto",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        }
    ],
    async run(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "logs") {
            const channel = interaction.options.getChannel("canal", true);
            const configPath = path.join(process.cwd(), "config.json");
            
            let config: any = {};
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            }

            config.ticketLogChannelId = channel.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

            await interaction.reply({
                content: `✅ Canal de logs configurado para ${channel}!`,
                ephemeral: true
            });
        }
    }
});
