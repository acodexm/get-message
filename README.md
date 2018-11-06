# get-message
Small lib as a helper or replacement for react-intl


## Description

This small library provides a simpler way of using international translations in your app.

By using it you can inject your translation anywhere by passing function

## Use cases

Have you ever had a problem with passing <FormatMessage/> or intl.formattedMessage() 
to input placeholder or any other component which don't allow Components or JSX?
 
Tired of injectIntl wrapper? or constantly passing message id and defaultMessage everywhere?


## Usage

Call Singleton.getInstance(messages[lang]) anywhere in your App, 
if you want to replace react-intl just replace <IntlProvider/> 

if lang gets messages or lang has changed instance will be updated

then 
```
import getMessage from 'get-message'
```

anywhere

and use it like

```
<Input placeholder={getMessage(prefix)(id)}/>
```

or 
```
const getMsg=getMessage('prefix')

const Inputs=({id1,id2,id3})=>(
    <div>
        <Input placeholder={getMessage(id1)}/>
        <Input placeholder={getMessage(id2)}/>
        <Input placeholder={getMessage(id3)}/>
    </div>
)
```
## Todo
- [ ] more details specification
- [ ] more features and use cases