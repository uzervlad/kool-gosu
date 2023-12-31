# kool

An overlay for gosumemory

**[Recommended]** [StreamCompanion port](https://github.com/uzervlad/kool-sc) of this overlay

## Screenshots

<details>
  <summary>Expand</summary>

  ![image](/img/a.png)

  ![image](/img/b.png)

</details>

## Issues

* BPM counter shows max BPM instead of current, since gosumemory doesn't provide current BPM

## Setup

1. Download latest version [here](https://github.com/uzervlad/kool-gosu/releases/latest/download/kool.zip)

2. Create a new folder called `Kool` in your gosumemory/Static folder

3. Unzip `kool.zip` into the folder from step 2

4. Open `http://localhost:24050/Kool/`

5. To update, run `update.exe` ([Source](https://github.com/uzervlad/simple-gh-updater))

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
