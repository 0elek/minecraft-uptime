// import z from "zod"
import { EmbedBuilder } from "@discordjs/builders"

// const PlayerSchema = z.object(
//     {
//         name: z.string(),
//         uuid: z.string(),
//         textures: z.object({
//             skin: z.string(),
//             cape: z.string().optional(),
//             optifineCape: z.string().optional(),
//             minecraftcapes: z.string().optional(),
//         })
//     }
// )

const PlayerBuilder = (name: string, uuid: string, skin: string | undefined, cape: string | undefined, optifineCape: string | undefined, minecraftcapes_cape: string | undefined) => {

    // let p = PlayerSchema.parse({
    //     name: name,
    //     uuid: uuid,
    //     texture:{
    //         skin: typeof skin == "string" ? skin : undefined,
    //         cape: typeof cape == "string" ? cape : undefined,
    //         optifineCape: typeof optifineCape == "string" ? optifineCape : undefined,
    //     }
    // })

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
    return embed
}


export default PlayerBuilder