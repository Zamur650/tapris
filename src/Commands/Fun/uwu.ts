import { Command } from '../../Interfaces'
import { MessageEmbed } from 'discord.js'
import { UwuResponse } from '../../Interfaces/Nekoslife'
import axios from 'axios'

export const command: Command = {
	name: 'uwu',
	description: 'Get UwU text',
	aliases: ['text'],
	run: async (client, message, args) => {
		if (args.length == 0)
			return message.channel.send(
				'You did not supply enough arguments :no_entry_sign:'
			)

		var response: UwuResponse = (
			await axios.get(
				`https://nekos.life/api/v2/owoify?text=${encodeURI(args.join(' '))}`
			)
		).data

		const Embed = new MessageEmbed()
			.setColor(client.config.botColor)
			.setTitle(response.owo)

		return message.channel.send({ embeds: [Embed] })
	}
}
