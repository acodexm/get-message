# get-message

Small lib as a helper or replacement for react-intl

This library provides API to format dates, numbers, and strings, including pluralization and handling translations.

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
![Coverage functions][coverage-badge-green]
[![Dependency Status][david-badge]][david]

## Description

This small library provides a simpler way of using international translations in your app.

By using it you can inject your translation anywhere by passing function

### Installation

```npm
npm install get-message --save
or
yarn add get-message
```

### Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 150+ languages.
- Runs in the browser and Node.js.
- Built on standards.

### [Documentation][]

get-message is based on React Intl, so all functionality should remain the same.
React Intl's docs are in this GitHub repo's [Wiki][documentation], [**Get Started**][getting started]. There are also several [runnable example apps][examples] which you can reference to learn how all the pieces fit together.

## Use cases

Have you ever had a problem with passing `<FormatMessage/>` or `intl.formattedMessage()`
to input placeholder or any other component which don't allow Components or JSX?

Tired of `injectIntl` wrapper? or constantly passing message id and defaultMessage everywhere?

## Usage

```
config props ={
  locale: string,
  timeZone: string,
  formats: object,
  messages: object,
  defaultLocale: string,
  defaultFormats: object,
  onError: func
}
```

Call anywhere in your App:

```
const config={locale: lang, messages: messages[lang]}
MessageProvider.initialize(config)
```

or if you want to replace react-intl just remove <IntlProvider/> and initialize MessageProvider

```js
import { MessageProvider } from 'get-message';
import messages from './messages';
const App = ({ lang }) => {
  MessageProvider.initialize({ locale: lang, messages: messages[lang] });
  return <YourApp />;
};
```

if messages, lang or any other config has changed MessageProvider will be updated

##

now somewhere inside <YourApp/>

```
import getMessage from 'get-message'
```

and use it like

```
<Input placeholder={getMessage(prefix,type)(id,options)}/>
```

`type` is one of:

- date, time, number, relative, plural => prefix is omitted, id is value
- html, 'blank' => prefix is not required,

options: variables, formats etc like in react-intl

example:

```
const getMsg=getMessage('prefix')

const Inputs=({id1,id2,id3})=>(
    <div>
        <Input placeholder={getMsg(id1)}/>
        <Input placeholder={getMsg(id2)}/>
        <Input placeholder={getMsg(id3)}/>
    </div>
)
```

## More info

get-messages is just one of many packages that make up the [FormatJS suite of packages][formatjs github], and you can contribute to any/all of them, including the [Format JS website][formatjs] itself.

## Todo

- [ ] more details specification
- [x] more features and use cases

##Contribute
feel free to improve this lib :)

##License

This software is free to use. GNU license.
See the [LICENSE file][] for license text and copyright information.

[npm]: https://www.npmjs.org/package/get-message
[npm-badge]: https://img.shields.io/npm/v/get-message.svg?style=flat-square
[coverage-badge-green]: badge-functions.svg
[david]: https://david-dm.org/acodexm/get-message
[david-badge]: https://img.shields.io/david/acodexm/get-message.svg?style=flat-square
[travis]: https://travis-ci.org/acodexm/get-message
[travis-badge]: https://img.shields.io/travis/acodexm/get-message/master.svg?style=flat-square
[formatjs]: http://formatjs.io/
[formatjs github]: http://formatjs.io/github/
[documentation]: https://github.com/yahoo/react-intl/wiki
[getting started]: https://github.com/yahoo/react-intl/wiki#getting-started
[contributing]: https://github.com/acodexm/get-message/blob/master/CONTRIBUTING.md
[license file]: https://github.com/acodexm/get-message/blob/master/LICENSE.md
