# kool

An overlay for gosumemory

## Screenshots

<details>
  <summary>Expand</summary>

  ![image](https://github.com/uzervlad/kool-gosu/assets/24654479/225ff4a0-62d3-46eb-8cc6-422dfcb076a0)

  ![image](https://github.com/uzervlad/kool-gosu/assets/24654479/72ddc55a-a3e3-45ce-847f-5940708e0946)

</details>

## Setup

1. Download latest version [here](https://github.com/uzervlad/kool-gosu/releases/latest/download/kool.zip)

2. Unzip `Kool` to your gosumemory/Static folder

3. Open `http://localhost:24050/Kool/`

4. To update, run `update.exe` ([Source](https://github.com/uzervlad/simple-gh-updater))

## Settings

To apply settings, add them in the link after `#` joined by `+`.

For example: `http://localhost:24050/Kool/#hide-fc-pp+hide-stats-l`

Available settings:

* `hide-hits` - hides hit counts in gameplay
* `hide-mods` - hides mods
* `hide-fc-pp` - hides "if fc pp" counter
* `hide-stats-l`/`hide-stats-r` - hides map stats on left/right side

## Depends on:

* [CountUp.js](https://github.com/inorganik/CountUp.js)
* [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket)
