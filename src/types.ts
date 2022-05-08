import { Option } from 'kokkoro';

export interface SaucenaoOption extends Option {
  db: number;
  output_type: number;
  testmode: number;
  numres: number;
  minSimilarity: number;
}
