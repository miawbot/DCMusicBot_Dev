module.exports = {
  name: 'userinfo',
  // description: 'Get information about a user.',
  description: '获取一个用户的信息',
  options: [
    {
      // name: 'user',
      name: '用户',
      type: 6, //USER TYPE
      // description: 'The user you want to get info about',
      description: '你想获得的用户信息',
      required: true,
    },
  ],
  execute(interaction, client) {
    const member = interaction.options.get('用户').value;
    const 用户 = client.users.cache.get(member);

    interaction.reply({
      // content: `Name: ${用户.username}, ID: ${用户.id}, Avatar: ${用户.displayAvatarURL({dynamic: true})}`,
      content: `用户名: ${用户.username}, ID: ${用户.id}, 头像: ${用户.displayAvatarURL({ dynamic: true })}`,
      ephemeral: true,
    });
  },
};
