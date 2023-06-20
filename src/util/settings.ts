import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();


const SettingsSchema = z.object({
    server: z.object({
        address: z.string(),
        port: z.number(),
    }),
    discord: z.object({
        token: z.string(),
        invite: z.string().url().optional(),
        channels: z.object({
            alert: z.object({
                id: z.string(),
                ipSafe: z.boolean(),
            }),
        }),

    }),
    onHost: z.boolean(),
    // moved invite to discord 
    other: z.object({
        website: z.string().url().optional(),
        wiki: z.string().url().optional(),
    }),
});

const settings = SettingsSchema.parse({
    server: {
        address: process.env.SERVER?.split(":")[0]?.toString(),
        port: parseInt(process.env.SERVER?.split(":")[1] as string),
    },
    discord: {
        token: process.env.TOKEN,
        invite: process.env.DISCORD_INVITE,
        channels: {
            alert: {
                id: process.env.ALERT_CHANNEL?.split(",")[0].toString(),
                ipSafe: process.env.ALERT_CHANNEL?.split(",")[1] == "true" ? true : false,
            },
        },
    },
    onHost: process.env.ON_HOST == "true" ? true : false,
    other: {
        website: process.env.WEBSITE_WIKI?.toString(),
        wiki: process.env.WEBSITE?.toString(),
    },
});

export default settings;



