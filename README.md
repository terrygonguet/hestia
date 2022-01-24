# Project Hestia

This extension replaces the "new tab" page and allows you to fully customize it.

Documentation coming soon™

## Building

This is a web based node project, simply run:

```bash
git clone https://github.com/terrygonguet/hestia
cd hestia
npm install
npm run build
```

The build files will be in the `dist` folder.

This project is built using node 16 but will probably work with a few previous versions.

If you also want the extension zip, run the following after running the previous commands:

```bash
npm run bundle
```

The file will be in the `web-ext-artifacts` folder.
