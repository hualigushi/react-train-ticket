## 线上地址

`https://touch.train.qunar.com`

## 多页面入口配置

1. public 文件夹创建tickect.html
2. config/paths.js
   `appTicketHtml: resolveApp('public/ticket.html'),`
   `appTicketJs: resolveModule(resolveApp, 'src/index/ticket'),`
3. config/webpack.config.js

   ```
   entry: {
      index: [paths.appIndexJs, isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient')].filter(Boolean),
      ticket: [paths.appTicketJs, isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient')].filter(Boolean),
    },
   ```
4. config/webpack.config.js
   plugins
   ```
   new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appTicketHtml,
            filename: 'ticket.html',
            chunks: ['ticket']
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
   ```
5. 执行 `npm run build`，打包失败，报错 `Cannot read property 'filter' of undefined`
   原因
   
   ```
   // 这是旧版的 ManifestPlugin 配置
    new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
    }),
      
    // 这是新版的 ManifestPlugin 配置
    new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce((manifest, file) => {
                manifest[file.name] = file.path;
                return manifest;
            }, seed);
            const entrypointFiles = entrypoints.main.filter(
                fileName => !fileName.endsWith('.map')
            );
         console.log('!!', entrypointFiles)
   
            return {
                files: manifestFiles,
                entrypoints: entrypointFiles,
            };
        },
    }),
   ```

     可以看到配置项中多了 generate 这一属性，其中就有用到 filter 方法。其中 `entrypoints.main` 调用了 filter 方法，经过输出得知 `entrypoints.main` 的值是与 entry 配置对应的。

     默认情况下 entry 的值是一个 Array，因此 `entrypoints.main` 的值也一个 Array，但是配置多页面时是把其改为了 Object，Object 没有 filter方法，因此报错。

     **解决方案**

      方案一：删除 generate属性，保持与老版本生成的 create-react-app 生成的 ManifestPlugin 配置一致。

      方案二：修改 `entrypoints.main` 中的 main 为你在 entry 中配置的项目首页的 key。我的 entry 配置中首页 的 key 为 index ，因此可改为 entrypoints.index。

      ```
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.index.filter(
            fileName => !fileName.endsWith('.map')
          );
    
          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
    ```
    再次运 npm run build 即可编译成功。


6. 编译多个入口页面的工程
```
webpack.config.js

output: {
     ···
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/[name].js',
    ···
```
## 代码格式化

`npm i husky lint-staged -D`
`npm i prettier -D`

`package.json`

```
"scripts": {
    "format": "prettier src/**/*.{js,jsx,css,md} --write && eslint src/**/*.{jsx,js} --fix"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "eslint:recommended"
    ],
    "plugins": [
      "react-hooks"
    ],
    "rules": {
      "react/jsx-indent": [
        "error",
        4
      ],
      "react-hooks/rules-of-hooks": "error"
    }
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{jsx,js}": [
      "prettier -- write",
      "eslint --fix",
      "git add"
    ],
    "*.{css, md}":[
      "prettier -- write",
      "git add"
    ]
  },
  ```
  根目录下新建`prettier.config.js`
  ```
  module.exports = {
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'es5',
};
```

运行 `npm run format`


# 知识点

1. memo

`import {memo} from 'react'` 对于无状态子组件，采用function的形式。便可以使用memo方法。进行子组件更新渲染的判断。 

原理就是上述purecomponent效果一致； 

`const Foo = memo( function Foo(props){ return {props.person.age} //也不会更新 })`

2. useState怎么知道返回的是当前组件的count而不是其他组件的count

因为 js是单线程的，因此当useState被调用时只可能在唯一一个组件的上下文中；

3. setCount不改变count值（基础数据类型）时组件不会重新渲染。 复杂数据类型的某个数形变化或者 重新赋值一个相同结构的对象 ，都会重新渲染
