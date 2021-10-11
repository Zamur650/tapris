import { Message, MessageEmbed } from 'discord.js'
import {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	DiscordGatewayAdapterCreator
} from '@discordjs/voice'
import ytdl from 'ytdl-core'

export const play = async (client, message: Message) => {
	if (client.music.queue.length == 0)
		return message.channel.send('Queue is empty :no_entry_sign:')
	if (!message.member.voice.channel)
		return message.channel.send('You are not in channel :no_entry_sign:')

	client.music.connection = joinVoiceChannel({
		channelId: message.member.voice.channel.id,
		guildId: message.guildId,
		adapterCreator: message.guild
			.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
	})

	const stream = ytdl(client.music.queue[0], { filter: 'audioonly' })
	const resource = createAudioResource(stream, {
		inputType: StreamType.Arbitrary
	})
	const player = createAudioPlayer()

	var info = await ytdl.getInfo(client.music.queue[0])

	const Embed = new MessageEmbed()
		.setColor(client.config.botColor)
		.setTitle(info.videoDetails.title)
		.setURL(info.videoDetails.video_url)
		.setDescription(info.videoDetails.description)
		.addFields(
			{
				name: 'Views',
				value: info.videoDetails.viewCount,
				inline: true
			},
			{
				name: 'Likes',
				value: `${info.videoDetails.likes} / ${info.videoDetails.dislikes}`,
				inline: true
			}
		)
		.setImage(info.videoDetails.thumbnails[0].url)
		.setTimestamp(new Date(info.videoDetails.publishDate))

	message.channel.send({ embeds: [Embed] })

	player.play(resource)
	client.music.connection.subscribe(player)

	player.on(AudioPlayerStatus.Idle, () => {
		client.music.queue.shift()

		if (client.music.queue.length == 0) return client.music.connection.destroy()

		return play(client, message)
	})
}
