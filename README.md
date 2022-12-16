# kokkoro-plugin-saucenao

> SauceNAO 图片搜索

## 安装

```shell
# 切换至 bot 目录
cd bot

# 安装 npm 包
npm i kokkoro-plugin-saucenao
```

## 配置项

```typescript
interface SaucenaoOption extends Option {
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
```

## 环境变量

你可以在项目根目录下创建 `.env` 文件

```ini
# API key
SAUCENAO_API_KEY=3d14159265358979323846264338327950288419
```
