import { ApplicationCommandDataResolvable, Client, Colors, EmbedBuilder, Message } from "discord.js"
import { owners } from "./config.json"
const client = new Client({ intents: 3276799 })
client.login(Bun.env.TOKEN)

// Este es el evento que se ejecuta cuando el bot está listo
client.on("ready", () => {
    const cmds: ApplicationCommandDataResolvable[] = [
        { 
            name: "ping",
            description: "Muestra el ping del bot",
            type: 1
        },
        {
            name: "hola",
            description: "Muestra un mensaje de hola",
            type: 1
        },
        {
            name: "ayuda",
            description: "Muestra los comandos",
            type: 1
        }
    ]
    client.application?.commands.set(cmds)
        .then(() => console.log("Comandos creados"))
        .catch((err) => console.log(err))
})

// Esto es un tipo, para las funciones.
type MsgFunction = (msg: Message) => void;
// Una clase es como una función que es una porción de código pero más fácil de construir ya que tiene métodos y propiedades.
class CommandB {
    #prefix: string = "!"
    constructor(public name: string, public msg: Message, private execute: MsgFunction) { }
    public executeCommand() { if(this.msg.content === (this.#prefix + this.name)){ this.execute(this.msg) } }
}
// Esto es otra forma de declarar una función, en este caso devuelve una clase.
const Command = (name: string, msg: Message, execute: MsgFunction) => {
    return /* new es para inicializar una nueva clase*/ new CommandB(name, msg, execute)
}

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;

    switch (interaction.commandName) {
        case "ping":
            interaction.reply({ content: `Your ping is **${client.ws.ping}ms**`, ephemeral: true })
            break;
        case "hola":
            const array_owners = owners.map(x => client.users.cache.get(x)?.tag)
            const embed = new EmbedBuilder()
            .setTitle("Hola!")
            .setDescription("Los dueños son: " + array_owners.map(x => `\`${x}\``).join(", "))
            .setColor(Colors.DarkGreen)
            .setTimestamp()
            if(typeof interaction.guild?.iconURL() === "string") embed.setFooter({ text: (interaction.guild?.name as string), iconURL: (interaction.guild?.iconURL() as string) })
            if(typeof interaction.user.avatarURL() === "string") embed.setAuthor({ iconURL: (interaction.user.avatarURL() as string), name: interaction.user.username })
            if(typeof client.user?.avatarURL() === "string") embed.setThumbnail((client.user?.avatarURL() as string))
            interaction.reply({ embeds: [embed] })
            break;
        case "ayuda":
            const commands = ["ping", "hola", "ayuda"].map(x => `\`${x}\``).join(", ")
            interaction.reply({ content: `Los comandos son: ${commands}`, ephemeral: true })
            break;
        default:
            break;
    }
})
// Este es cuando se crea un mensaje
client.on("messageCreate", async (message) => {
    if(message.guild === null) return;
    // Usamos la función Command para crear un comando.
    Command("ping", message, (msg) => {
        // Realmente el msg no es necesario, pero lo dejo para que aprendas a usar este tipo de funciones
        msg.reply(`Your ping is **${client.ws.ping}ms**`) // Usamos el método reply para enviar  una respuesta, client.ws.ping representa los ms
        console.log(`Pong! ${client.ws.ping}`) // Mandamos un mensaje a la consola.
    }).executeCommand()
    Command("hola", message, (msg) => {
        // haremos un embed como último ejemplo
        const array_owners = owners.map(x => client.users.cache.get(x)?.tag)
        const embed = new EmbedBuilder()
        .setTitle("Hola!")
        .setDescription("Los dueños son: " + array_owners.map(x => `\`${x}\``).join(", "))
        .setColor(Colors.DarkGreen)
        .setTimestamp()
        if(typeof msg.guild?.iconURL() === "string") embed.setFooter({ text: (msg.guild?.name as string), iconURL: (msg.guild?.iconURL() as string) })
        if(typeof msg.author.avatarURL() === "string") embed.setAuthor({ iconURL: (msg.author.avatarURL() as string), name: msg.author.username })
        if(typeof client.user?.avatarURL() === "string") embed.setThumbnail((client.user?.avatarURL() as string))
        msg.reply({ embeds: [embed] })
        console.log("Comando ejecutado")
    }).executeCommand()
    // Hoy aprenderemos sobre el comando de ayuda y modals
    Command("ayuda", message, (msg) => {
        const commands = ["ping", "hola", "ayuda"].map(x => `\`${x}\``).join(", ")
        msg.reply(`Los comandos son: ${commands}`)
    }).executeCommand()
}) 
// 