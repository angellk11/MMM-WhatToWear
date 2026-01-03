# MMM-WhatToWear

*MMM-WhatToWear* is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) that displays types of clothes to wear based on the weather forecast  and your personal preferences. By default it will show recommondations for the next ~8 hours.

Adapted from [MMM-WeatherDependentClothes](https://github.com/fruestueck/MMM-WeatherDependentClothes).

<!-- ## Screenshot

![Example of MMM-WhatToWear](./example_1.png) -->

## Installation

### Install

In your terminal, go to the modules directory and clone the repository:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/angellk11/MMM-WhatToWear.git
```

### Update

Go to the module directory and pull the latest changes:

```bash
cd ~/MagicMirror/modules/MMM-WhatToWear
git pull
```

## Configuration

To use this module, you have to add a configuration object to the modules array in the `config/config.js` file.

### Example configuration

Minimal configuration to use the module:

```js
    {
        module: 'MMM-WhatToWear',
        position: 'lower_third',
        config: {
            apiKey: "", // openweathermap.org 3.0 API key
            lat: "", // latitude
            lon: "", // your longitude
            clothing: [ // optionally customize preferred temp ranges
                {
                    id: "heavy-coat",
                    label: "Heavy Coat",
                    minTemp: -10, // °F
                    maxTemp: 32, // °F
                    img: "images/heavy-coat.png",
                    tags: ["insulating"],
                },
                // See module for complete list
            ]
        }
    },
```

## Configuration options

The following properties can be configured:


| Option                       | Description
| ---------------------------- | -----------
| `lat`                   | The latitude used for weather information. <br><br> **Example:** `'36.092'` <br> **Default value:** `'36.092'`
| `lon`                 | The longitude used for weather information. <br><br> **Example:** `'-112.843'` <br> **Default value:** `'-112.843'`
| `apiKey`                      | The [OpenWeatherMap](https://openweathermap.org/api) API key, which can be obtained by creating an OpenWeatherMap account. <br><br>  This value is **REQUIRED**
| `units`                      | What units to use. Specified by config.js <br><br> **Possible values:** `config.units` = Specified by config.js, `default` = Kelvin, `metric` = Celsius, `imperial` =Fahrenheit <br> **Default value:** `config.units` <br><br> **Note:** Default clothing temperature preferences are in Fahrenheit. 
| `updateInterval`             | How often does the content needs to be fetched? (Milliseconds) <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `20*60*1000` (20 minutes)
| `initialLoadDelay`           | The initial delay before loading. If you have multiple modules that use the same API key, you might want to delay one of the requests. (Milliseconds) <br><br> **Possible values:** `1000` - `5000` <br> **Default value:**  `1000`
| `iconPath`	           | The path to the icons folder. <br><br> **Default value:**  `'icons/'`
| `iconScale`	           | Scale of PNG icons (1 stands for 100%). <br><br> **Default value:**  `1`
| `iconSize`	           | Define px iconSize for PNG icons. <br><br> **Default value:**  `64`
| `rainProbThreshold`           | The minimum threshold of precipitation probability (pop) to trigger rain gear. (percentage) <br><br> **Default value:**  `0.25`
| `rainVolThreshold`           | The minimum threshold of precipitation to trigger rain gear. (mm/hr) <br><br> **Default value:**  `3`
| `windSpeedThreshold`           | The minimum threshold of windspeed to trigger extra coverage. (mph) <br><br> **Default value:**  `15`  
| `preferences`	           | Define a list of clothes and conditions to be matched. <br><br> **Default value:**  see clothing prefereces


### Clothing preferences
Define a list of clothes to be matched against the (extended) weather forecast. Each list element represents one clothing based on weather `conditions`.

Examples:
````
preferences: [
        {
                id: "heavy-coat",
                img: "icons/jacket-cold.png",
                label: "Heavy Coat",
                maxTemp: 32,
                minTemp: -999,
                tags: ["insulating"]
            },
            {
                id: "sweater",
                img: "icons/hoodie.png",
                label: "Sweater",
                maxTemp: 50,
                minTemp: 33,
                tags: ["insulating"]
            },
            {
                id: "jacket",
                img: "icons/jacket.png",
                label: "Jacket",
                maxTemp: 61,
                minTemp: 51,
                tags: ["insulating"]
            },
            {
                id: "long-sleeve",
                img: "icons/shirt.png",
                label: "Long Sleeve",
                maxTemp: 68,
                minTemp: 62,
                tags: []
            },
            {
                id: "tshirt",
                img: "icons/shirt-t.png",
                label: "T-Shirt",
                maxTemp: 82,
                minTemp: 69,
                tags: []
            },
    [...]
]
````
<b>Example description:</b> The heavy coat will be displayed when the temperature is below 32 degrees Fahrenheit, and the sweater between 33 and 50 degrees. When rainfall is above 3mm and the temperature above 60 degrees, the umbrella will be displayed.

## To Do

Customization of rain, wind, and other range options.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Changelog

All notable changes to this project will be documented in the [CHANGELOG.md](CHANGELOG.md) file.
