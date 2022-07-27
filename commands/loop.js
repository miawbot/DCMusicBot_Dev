const { GuildMember } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
  name: 'loop',
  // description: 'Sets loop mode',
  description: '设置循环模式',
  options: [
    {
      // name: 'mode',
      name: '模式',
      type: 'INTEGER',
      // description: 'Loop type',
      description: '循环模式',
      required: true,
      choices: [
        {
          // name: 'Off',
          name: '单次播放',
          value: QueueRepeatMode.OFF,
          description: '单次播放',
        },
        {
          // name: 'Track',
          name: '单曲循环',
          value: QueueRepeatMode.TRACK,
          description: '单曲循环',
        },
        {
          // name: 'Queue',
          name: '列表循环',
          value: QueueRepeatMode.QUEUE,
          description: '列表循环',
        },
        {
          // name: 'Autoplay',
          name: '自动播放推荐歌曲',
          value: QueueRepeatMode.AUTOPLAY,
          description: '真·随机播放',
        },
      ],
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

      const queue = player.getQueue(interaction.guildId);
      if (!queue || !queue.playing) {
        /* return void interaction.followUp({
                content: '❌ | No music is being played!'
              }); */
        return void interaction.followUp({
          content: '❌ | 没有音乐在播放！'
        });
      }

      const loopMode = interaction.options.get('模式').value;
      const success = queue.setRepeatMode(loopMode);
      const 模式 = loopMode === QueueRepeatMode.OFF ? '1️⃣' : loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '🌐';

      return void interaction.followUp({
        // content: success ? `${mode} | Updated loop mode!` : '❌ | Could not update loop mode!',
        content: success ? `${模式} | 已更新循环模式！` : '❌ | 无法更新循环模式！',
      });
    } catch (error) {
      console.log(error);
      interaction.followUp({
        // content: 'There was an error trying to execute that command: ' + error.message,
        content: '❌ | 在试图执行该命令时出现了错误：' + error.message,
      });
    }
  },
};
// —— 自己添加 ——
module.exports.config = {
  name: `play`,
  aliases: ['repeat']
}
