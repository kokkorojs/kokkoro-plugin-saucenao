import { Plugin, Option, Scanner, segment, ImageElem } from 'kokkoro';
import { SaucenaoService } from './service';

export interface SaucenaoOption extends Option {
  /** 结果返回数 */
  results: number;
  /** 数据库索引数组，例如只搜索 Pixiv [5] */
  mask: number[];
  /** 数据库索引（结果排除） */
  excludeMask: number[];
  /** 测试模式 */
  testMode: boolean;
  /** 搜索特定数据库索引而不必生成掩码 */
  db: number;
  /** 最低相似度，低于该数值的略缩图将会和谐 */
  similarity: number;
}

const option: SaucenaoOption = {
  apply: true,
  lock: false,
  results: 5,
  mask: [],
  excludeMask: [],
  testMode: false,
  db: 999,
  similarity: 50,
};
const { version } = require('../package.json');

const plugin = new Plugin('saucenao', option);
const service = new SaucenaoService(plugin.logger, process.env.SAUCENAO_API_KEY);

plugin
  .version(version)

plugin
  .command('search', 'group')
  .sugar(/^搜图$/)
  .action(async (ctx) => {
    const { bot, option } = ctx;
    const scanner = new Scanner(bot);

    await ctx.reply(`请发送你要搜索的图片 (●'◡'●)`);

    const { url } = await scanner.nextImage(ctx.sender.user_id) as ImageElem;
    const results = await service.searchImage(url!, option as SaucenaoOption);
    const results_length = results.length;
    const forwardMessage = [];

    for (let i = 0; i < results_length; i++) {
      const result = results[i];
      const { site, similarity, thumbnail, authorName, url } = result;
      const message = {
        message: [`平台：${site}\n封面：`, '\n', segment.image(thumbnail), `相似度：${similarity}\n作者：${authorName}\n来源：${url}`],
        user_id: ctx.self_id,
        nickname: bot.nickname,
      };
      forwardMessage.push(message);
    }
    await bot
      .makeForwardMsg(forwardMessage)
      .then(xml => ctx.reply(xml))
  })
