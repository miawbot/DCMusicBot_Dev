const {GuildMember} = require('discord.js');
const {QueryType} = require('discord-player');

module.exports = {
  name: 'play',
  // description: 'Play a song in your channel!',
  description: '在你的频道中播放一首歌',
  options: [
    {
      name: 'miaw',
      type: 3, // 'STRING' Type
      // description: 'The song you want to play',
      description: '你想要播放的歌曲',
      required: true,
    },
  ],
  async execute(interaction, player) {
    try {
      if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({
          // content: 'You are not in a voice channel!',
          content: '⚠️ | 你不在一个语音频道里！',
          ephemeral: true,
        });
      }

      if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
      ) {
        return void interaction.reply({
          // content: 'You are not in my voice channel!',
          content: '⚠️ | 你不在我所在的语音频道里!',
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const 歌名或链接 = interaction.options.get('miaw').value;
      const searchResult = await player
        .search(歌名或链接, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({ content: '❌ | 没有找到任何结果！'});

      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
				quality: `highest`,
				filter: `audioonly`,
				highWaterMark: 1 << 25,
				dlChunkSize: 0,
			},
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          // content: 'Could not join your voice channel!',
          content: '❌ | 无法加入你的语音频道!'
        });
      }

      await interaction.followUp({
        // content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`, 
        content: `⏱ | 正在加载你的${searchResult.playlist ? '歌单' : '歌曲'}...`,
      });
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      interaction.followUp({
        // content: 'There was an error trying to execute that command: ' + error.message,
        content: '在试图执行该命令时出现了一个错误：' + error.message,
      });
    }
  },
};
// ——自己添加——
module.exports.config = {
  name: `play`,
  aliases: ['p']
}
