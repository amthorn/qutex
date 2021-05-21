# Troubleshooting

When working with Qutex, often you may find that you need to either troubleshoot a particular workflow or somehow otherwise debug. There are a few things that can help here.

## Help Command

The help command will return a [Cisco Webex card](https://developer.webex.com/docs/api/guides/cards) containing the available commands that exist as well as their authorization levels. It will also display some basic information about the release, the documentation, the author, the release date, and a link where you can open issues.

## Using Debug mode

If you add `| debug` to the end of any command, Qutex will return the debug information to you within your Cisco Webex client. This can be very useful for debugging how Qutex operated on the command that you sent and can be key to determining why a particular workflow is not working, should that occur.

???+ example
    `pun | debug`

    ``` json
    {
        "request": {
            "id": "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvNmI0ZDQgibberish",
            "roomId": "Y2lzY29zcGFyazovL3VzL1JPT00vMGE0ZGY1ZDAtNDgibberish",
            "roomType": "group",
            "personId": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9kODRkZgibberish",
            "personEmail": "avatheavian@gmail.com",
            "mentionedPeople": [
                "Y2lzY29zcGFyazovL3VzL1BFT1BMRS82MGQ5ZmQ4ZS0gibberish"
            ],
            "created": "2021-05-19T05:59:48.630Z"
        },
        "initiative": {
            "rawCommand": "pun",
            "destination": {
                "roomId": "Y2lzY29zcGFyazovL3VzL1JPT00vMGE0ZGY1ZDAtNDgibberish"
            },
            "debug": true,
            "user": {
                "id": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9kODRkZgibberish",
                "displayName": "Ava Thorn"
            },
            "data": true,
            "action": {
                "AUTHORIZATION": "none",
                "COMMAND_TYPE": "operation",
                "COMMAND_BASE": "pun",
                "DESCRIPTION": "Returns a pun:) hehe"
            },
            "mentions": []
        },
        "result": "A magician was driving down the street and then he turned into a driveway."
    }
    ```
    A magician was driving down the street and then he turned into a driveway.

## Further Support

If you are still having issues or have any feature requests, feel free to open a new issue [here](https://github.com/amthorn/qutex/issues). I'd be happy to help:)