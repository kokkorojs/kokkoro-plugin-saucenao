import axios from 'axios';
import { join } from 'path';
import { getApiKey } from 'kokkoro';
import { segment } from 'kokkoro/lib/util';
import { SaucenaoOption } from './types';

const key = getApiKey('saucenao');
const api = 'https://saucenao.com/search.php';
const images_path = join(__dirname, '../images');

export async function searchImage(url: string, option: SaucenaoOption) {
  if (!key) {
    throw new Error('你没有添加 apikey ，saucenao 服务将无法使用');
  }
  url = url.indexOf('?') > -1 ? url.match(/.+(?=\?)/g)![0] : url;

  const { db, output_type, testmode, numres, minSimilarity } = option;
  const params = `?db=${db}&output_type=${output_type}&testmode=${testmode}&numres=${numres}&api_key=${key}&url=${url}`;

  try {
    const response = await axios.get(api + params);
    const { results } = response.data;
    const search_message: any[] = [];

    for (const result of results) {
      const { header: { similarity, thumbnail, index_name }, data } = result;
      const cover = similarity > minSimilarity
        ? segment.image(thumbnail)
        : segment.image(join(images_path, 'h.jpg'));

      search_message.push(`平台：${index_name.match(/(?<=: ).*(?=\ -)/g)}\n封面：`);
      search_message.push(cover);
      search_message.push(`\n相似：${similarity}%\n${data.ext_urls ? `地址：${data.ext_urls.join('\n')}` : `日文：${data.jp_name}\n英语：${data.eng_name}`}\n\n`);
    }
    return search_message;
  } catch (error) {
    throw error;
  }
}
