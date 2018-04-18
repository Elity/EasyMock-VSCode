# EasyMock

A vscode extension for mock data

## EasyMock Configuration

* `EasyMock.mockFolderName`: Any legal file name
* `EasyMock.serverPort`: Set the port number of the mock server
* `EasyMock.mockParse`: Enable build-in mock parse
* `EasyMock.helloPage`: Enable hello page on start

## Usage

Press `F1` and type `EasyMock`, select one of the following list item:

* `EasyMock: Run EasyMock` to run mock server
* `EasyMock: Stop EasyMock` to stop mock server

After select `EasyMock: Run EasyMock`,to view the example file at `{workspace}/{mockFolderName}/example.js`

## mock parse

### mock format

#### number

```
{
    "age|1-80":0
}
{
    "age":33
}
```

#### string

```
{
    "name|1-5":"a"
}
{
    "name":"aaa"
}
```

#### array

```
{
    "color|2":["red","blue","yellow","black"]
}
{
    "color":["blue","red"]
}
{
    "color|1-5":["red","blue","yellow","black"]
}
{
    "color":["blue","red","blue"]
}
```

#### object

```
{
    "province|2":{
        "110000": "北京市",
        "120000": "天津市",
        "130000": "河北省",
        "140000": "山西省"
    }
}
{
    "province":{
        "120000": "天津市",
        "140000": "山西省"
    }
}
```

#### boolean

```
{
    "bool|1-2":true
}
{
    "bool":false
}
```

### build-in placeholder function

* `str(min = 1, max = 10)` random string
* `cstr(min = 1, max = 10)` random chinese string
* `num(min = 0, max = 999999999, digit)` random number
* `img(w = 100, h = 100, bg, fg, format, text)` generate image url
* `color()` random hex color
* `time(future=false)` random timestamp
* `uuid()` random uuid
* `inc(init)` increament integer
* `paragraph(min = 1, max = 5)` generate paragraph
* `cparagraph(min = 1, max = 5)` generate chinese paragraph

#### usage

```
{
    id:"@inc(10000)",
    age:"@num(18,60)",
    avatar:"@img(100,100,'#f00','#fff','png')",
    uuid: "@uuid",
    desc: "@cparagraph"
}
{
    "id": "10000",
    "age": "28",
    "avatar": "http://dummyimage.com/100x100/f00/fff.png",
    "uuid": "8f3512d2-a86e-4008-b322-bd341c71d4ea",
    "desc": "拥须吧诗神居间物吸跳场少是卫系听满间场歌。"
}  
```
