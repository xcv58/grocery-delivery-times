# grocery-delivery-times

Grocery website delivery time check. It supports only Costco Same-Day Delivery for now. And more websites are coming.

## Usage

Please make sure you have `node` and `yarn` installed. https://classic.yarnpkg.com/en/docs/install, https://nodejs.org/en/download/

1. Clone this repo to your local machine
2. Run `yarn install`
3. Run `yarn start --help`

It will output:

```sh
$ yarn start --help
yarn run v1.19.2
$ node index.js --help
index.js

Watch grocery websites for delivery time

Options:
  --version                Show version number                         [boolean]
  --websites, -w           websites to watch
      [array] [required] [choices: "costco", "amazon-fresh"] [default: "costco"]
  --interval, -i           The check interval in minutes  [number] [default: 15]
  --zip, -z                The zip code to watch             [string] [required]
  --debug, -d                                         [boolean] [default: false]
  --costco_user, --cu                                                   [string]
  --costco_password, --cp                                               [string]
  --help                   Show help                                   [boolean]

```

Sample command to watch Costco for zip code `10001` every 45 minutes:

```sh
yarn start --costco_user xxx@xxx.com --costco_password 123456 -w costco -z 10001 -i 45
```

The output:
```
$ node index.js --costco_user xxx@xxx.com --costco_password 123456 -w costco -z 10001 -i 45
4/7/2020 22:52:45 INFO: watching websites: [ 'costco' ] for zip: "10001" on every 45 minutes
4/7/2020 22:52:46 INFO: Costco: check delivery time for zip: 10001
```

And it would send a system notification if find an available delivery time slot:

![image](https://user-images.githubusercontent.com/503123/78749305-d5bcf180-7922-11ea-9059-1a2b16a93e8e.png)

## Devlopment
TODO
