import { join } from 'path';
import { Logger } from 'kokkoro';
import { Readable } from 'stream';
import sagiri, { SagiriResult, Options } from 'sagiri';

import { SaucenaoOption } from '.';

type File = string | Buffer | Readable;
const xcw = join(__dirname, '../images/h.jpg');

export class SaucenaoService {
  /** API */
  api: string;
  client?: (file: File, optionOverrides?: Options) => Promise<SagiriResult[]>;

  constructor(
    /** 日志 */
    private logger: Logger,
    /** API key */
    private api_key?: string,
  ) {
    this.api = 'https://saucenao.com/search.php';
    this.client = this.api_key ? sagiri(this.api_key) : undefined;

    if (!this.api_key) {
      this.logger.warn('你没有添加 api key ，saucenao 服务将无法正常使用');
    }
  }

  async searchImage(url: string, option: SaucenaoOption) {
    if (!this.client) {
      throw new Error('你没有添加 api key ，saucenao 服务将无法正常使用');
    }
    const options: Options = {
      results: (<SaucenaoOption>option).results,
      mask: (<SaucenaoOption>option).mask.length ? (<SaucenaoOption>option).mask : undefined,
      excludeMask: (<SaucenaoOption>option).excludeMask,
      testMode: (<SaucenaoOption>option).testMode,
      db: (<SaucenaoOption>option).db,
    };
    const results = await this.client(url, options);

    results.map((result) => {
      if (result.similarity < option.similarity) {
        result.thumbnail = xcw;
      }
      return result;
    });
    return results;
  }
}
