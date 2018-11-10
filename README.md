# get-message

Small lib as a helper or replacement for react-intl

Internationalize [React][] apps. This library provides React components and an API to format dates, numbers, and strings, including pluralization and handling translations.

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Dependency Status][david-badge]][david]

## Description

This small library provides a simpler way of using international translations in your app.

By using it you can inject your translation anywhere by passing function

## Use cases

Have you ever had a problem with passing <FormatMessage/> or intl.formattedMessage()
to input placeholder or any other component which don't allow Components or JSX?

Tired of injectIntl wrapper? or constantly passing message id and defaultMessage everywhere?

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

Call

```
const config={locale: lang, messages: messages[lang]}
MessageProvider.initialize(config)
```

anywhere in your App,
if you want to replace react-intl just replace <IntlProvider/>

if lang gets messages or lang has changed instance will be updated

then

```
import getMessage from 'get-message'
```

anywhere

and use it like

```
<Input placeholder={getMessage(prefix,type)(id,options)}/>
```

type is one of:

- date, time, number, relative, plural => prefix is omitted, id is value
- html, 'blank' => prefix is not required,

options: variables, formats etc like in react-intl

or

```
const getMsg=getMessage('prefix',type)

const Inputs=({id1,id2,id3})=>(
    <div>
        <Input placeholder={getMsg(id1)}/>
        <Input placeholder={getMsg(id2)}/>
        <Input placeholder={getMsg(id3)}/>
    </div>
)
```

## Todo

- [ ] more details specification
- [x] more features and use cases

[npm]: https://www.npmjs.org/package/get-message
[npm-badge]: https://img.shields.io/npm/v/get-message.svg?style=flat-square
[david]: https://david-dm.org/acodexm/get-message
[david-badge]: https://img.shields.io/david/acodexm/get-message.svg?style=flat-square
[travis]: https://travis-ci.org/acodexm/get-message
[travis-badge]: https://img.shields.io/travis/acodexm/get-message/master.svg?style=flat-square
[react]: http://facebook.github.io/react/
[formatjs]: http://formatjs.io/
[formatjs github]: http://formatjs.io/github/
[documentation]: https://github.com/acodexm/get-message/wiki
[contributing]: https://github.com/acodexm/get-message/blob/master/CONTRIBUTING.md
[license file]: https://github.com/acodexm/get-message/blob/master/LICENSE.md
