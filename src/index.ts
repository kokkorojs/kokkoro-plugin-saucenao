import { Plugin } from 'kokkoro';
import { searchImage } from './service';
import { SaucenaoOption } from './types';

const option: SaucenaoOption = {
  apply: true,
  lock: false,
  db: 999,
  output_type: 2,
  testmode: 1,
  numres: 3,
  minSimilarity: 50,
};
export const plugin = new Plugin('saucenao', option).version(require('../package.json').version);

plugin
  .command('search', 'group')
  .sugar(/^搜图$/)
  .action(function () {
    const scanner = this.createScanner();

    this.reply(`请发送你要搜索的图片 (●'◡'●)`);
    scanner.nextImage(this.event.sender.user_id, (image) => {
      searchImage(image.url!, this.option as SaucenaoOption)
        .then((search_info) => {
          this.reply(search_info);
        })
        .catch(error => {
          this.reply(error.message);
        })
    })
  })
