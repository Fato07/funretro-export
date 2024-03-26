# FunRetro.io export

[![License][license-badge]][license-url]

> CLI tool to easily export [FunRetro.io](https://funretro.io/) retrospective boards using Playwright

## Installing / Getting started

It's required to have [npm](https://www.npmjs.com/get-npm) installed locally to follow the instructions.

```shell
git clone https://github.com/julykaz/funretro-export.git
cd funretro-export
npm install
```

## Usage

To export an Easy Retro board, run the script with the board's URL, an optional output file path, and the desired format
- `format1` for the original format,
- `format2` for the format listed in the acceptance criteria:

```shell
npm start -- "https://easyretro.io/publicboard/CGvRainS7bR2EGjqtYcJFwq1w5F3/0d92f1f5-a1f9-4d28-bb69-3139d0772a8a" "exported-file" "format2"

## Issues

If you encounter the following error
```
Error: browserType.launch: Browser is not supported on current platform
Note: use DEBUG=pw:api environment variable and rerun to capture Playwright logs.
```
then execute this command:
```
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true npm i -D playwright
```

## TODO

- [x] Export card comments
- [ ] PDF Format
- [x] CSV Format

## Licensing

MIT License

[license-badge]: https://img.shields.io/github/license/robertoachar/docker-express-mongodb.svg
[license-url]: https://opensource.org/licenses/MIT
