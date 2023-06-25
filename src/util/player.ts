import z from "zod"
import { EmbedBuilder } from "@discordjs/builders"

const PlayerSchema = z.object(
    {
        name: z.string(),
        uuid: z.string(),
        textures: z.object({
            skin: z.string(),
            cape: z.string().optional(),
            optifineCape: z.string().optional(),
            minecraftcapes: z.string().optional(),
        })
    }
)


type Player = {
    name: string,
    uuid: string,
    texture: {
        skin: string,
        cape: string | undefined,
        optifineCape: string | undefined,
        minecraftcapes_cape: string | undefined,
    }
}

const PlayerBuilder = (name: string, uuid: string, skin: string | undefined, cape: string | undefined, optifineCape: string | undefined, minecraftcapes_cape: string | undefined) => {

    PlayerSchema.parse({
        name: name,
        uuid: uuid,
        textures: {
            skin: skin,
            cape: cape,
            optifineCape: optifineCape,
            minecraftcapes: minecraftcapes_cape
        }
    });

    let embed = new EmbedBuilder()

    embed.setColor(1)
    embed.addFields({
        name: "name",
        value: name
    })
    embed.addFields({
        name: "uuid",
        value: uuid
    })
    if (skin != undefined) {
        embed.addFields({
            name: "skin",
            value: skin
        })
    }
    if (cape != undefined) {
        embed.addFields({
            name: "cape",
            value: cape
        })
    }
    if (optifineCape != undefined) {
        embed.addFields({
            name: "optifine cape",
            value: optifineCape
        })
    }
    if (minecraftcapes_cape != undefined) {
        embed.addFields({
            name: "minecraftcapes cape",
            value: minecraftcapes_cape
        })
    }
    embed.setImage(`https://nmsr.nickac.dev/fullbody/${uuid}`);

    return embed
}


export default PlayerBuilder