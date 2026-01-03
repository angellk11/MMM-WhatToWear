/* Magic Mirror
 * Module: WhatToWear
 *
 * Based on https://github.com/fruestueck/MMM-WeatherDependentClothes
 */

Module.register("MMM-WhatToWear", {
    // Default module config
    defaults: {
        lang: config.language,
        units: config.units,

        apiKey: "", // OpenWeatherMap.org API-Key

        lat: "36.092",
        lon: "-112.843",

        extendedHours: 9,

        updateInterval: 20 * 60 * 1000, // 20 Min

        iconPath: "icons/",
        iconScale: 1, //1.00 = 100%
        iconSize: 64, //px

        clothing: [
            //tops
            {
                id: "heavy-coat",
                img: "icons/jacket-cold.png",
                label: "Heavy Coat",
                maxTemp: 32,
                minTemp: -999,
                tags: ["insulating"],
            },
            {
                id: "sweater",
                img: "icons/hoodie.png",
                label: "Sweater",
                maxTemp: 50,
                minTemp: 33,
                tags: ["insulating"],
            },
            {
                id: "jacket",
                img: "icons/jacket.png",
                label: "Jacket",
                maxTemp: 61,
                minTemp: 51,
                tags: ["insulating"],
            },
            {
                id: "long-sleeve",
                img: "icons/shirt.png",
                label: "Long Sleeve",
                maxTemp: 68,
                minTemp: 62,
                tags: [],
            },
            {
                id: "tshirt",
                img: "icons/shirt-t.png",
                label: "T-Shirt",
                maxTemp: 82,
                minTemp: 69,
                tags: [],
            },
            // bottoms
            {
                id: "shorts",
                img: "icons/shorts.png",
                label: "Shorts",
                maxTemp: 999,
                minTemp: 83,
                tags: ["bottoms", "warm"],
            },
            {
                id: "long-pants",
                img: "icons/pants.png",
                label: "Long Pants / Jeans",
                maxTemp: 68,
                minTemp: -999,
                tags: ["bottoms", "cool"],
            },
            // supplemental
            {
                id: "raincoat",
                img: "icons/jacket-wet.png",
                label: "Raincoat",
                maxTemp: 999,
                minTemp: -999,
                tags: ["waterproof"],
            },
            {
                id: "umbrella",
                img: "icons/umbrella2.png",
                label: "Umbrella",
                maxTemp: 999,
                minTemp: -999,
                tags: ["waterproof"],
            },
            {
                id: "windbreaker",
                img: "icons/jacket.png",
                label: "Windbreaker",
                maxTemp: 999,
                minTemp: -999,
                tags: ["windproof"],
            },
            {
                id: "snow-pants",
                img: "icons/pants-cold.png",
                label: "Snow Pants",
                maxTemp: 32,
                minTemp: -999,
                tags: ["bottoms", "cool", "waterproof"],
            },
            {
                id: "default",
                img: "icons/default.png",
                label: "Layer Up",
                maxTemp: 999,
                minTemp: -999,
                tags: [],
            },
        ],

        rainProbThreshold: 0.25, // precipitation probability (pop)
        rainVolThreshold: 3, // mm/hr
        windSpeedThreshold: 15, // mph
    },

    /**
     * Apply the default styles.
     */
    // getStyles() {
    //     return ["template.css"];
    // },

    /**
     * Pseudo-constructor for our module. Initialize stuff here.
     */
    start() {
        Log.info("Starting module: " + this.name);
        this.loaded = false;

        // schedule first update
        this.scheduleUpdate(this.config.initialLoadDelay);
    },

    getDom() {
        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", "wrapper");
        if (this.config.apiKey === "") {
            wrapper.innerHTML =
                "Missing API key for openweathermap.org in the config for module: " +
                this.name + ".";
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = "LOADING";
            return wrapper;
        }

        return wrapper;
    },

    /* fetchHourlyForecast()
     * Fetches latest hourly weather data
     */
    async fetchHourlyForecast() {
        const lat = this.lat;
        const lon = this.lon;
        const units = this.units;
        const exclude = "minutely,daily,alerts";
        const url =
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${this.config.apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            this.updateDom;
            console.log(`OpenWeather error ${res.status}`);
        }
        return res.json();
    },
    /* renderHourBlock()
     * Calls chooseTopByTemp(), chooseBottomByTemp(), and chooseSupplementals() to customize HTML for forecast.
     */
    renderHourBlock(
        hourData,
        isCurrent = false,
    ) {
        const container = document.getElementById(
            "wrapper",
        );
        if (!container) return;

        const date = new Date(hourData.dt * 1000);
        const hourLabel = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });

        const temp = Math.round(hourData.temp);
        const supplements = chooseSupplementals(
            hourData,
        );
        const top = chooseBaseByTemp(temp);
        const bottom = chooseBottomByTemp(
            temp,
            supplements,
        );

        const block = document.createElement("div");
        block.className = "outfit-block";
        block.style.display = "flex";
        block.style.alignItems = "center";
        block.style.gap = "10px";
        block.style.margin = "6px 0";
        block.style.padding = isCurrent ? "8px" : "6px";
        block.style.border = isCurrent ? "2px solid #007acc" : "1px solid #ddd";
        block.style.borderRadius = "6px";
        block.style.background = isCurrent ? "#f0fbff" : "#fff";

        // image group
        const imgs = document.createElement("div");
        imgs.style.display = "flex";
        imgs.style.gap = "6px";
        imgs.style.alignItems = "center";
        [top, bottom, ...supplements].forEach(
            (item) => {
                if (!item) return;
                const img = document.createElement(
                    "img",
                );
                img.src = this.data.path + item.img;
                img.alt = item.label;
                //img.width = 56;
                img.height = this.config.iconSize * this.config.iconScale;
                img.style.objectFit = "cover";
                img.style.borderRadius = "6px";
                imgs.appendChild(img);
            },
        );

        const info = document.createElement("div");
        info.style.display = "flex";
        info.style.flexDirection = "column";
        info.style.minWidth = "180px";

        const topText = document.createElement("div");
        topText.style.fontWeight = isCurrent ? "700" : "600";
        topText.textContent = `${hourLabel} ${isCurrent ? "(now)" : ""}`;

        const middle = document.createElement("div");
        middle.style.fontSize = "14px";
        middle.style.marginTop = "2px";
        const supplementLabels = supplements.length
            ? " + " +
                supplements.map((s) => s.label).join(
                    ", ",
                )
            : "";
        middle.textContent =
            `${temp}° F — ${top.label} + ${bottom.label}${supplementLabels}`;

        info.appendChild(topText);
        info.appendChild(middle);

        if (hourData.weather && hourData.weather[0]) {
            const desc = document.createElement("div");
            desc.style.fontSize = "12px";
            desc.style.color = "#555";
            desc.textContent = hourData.weather[0].description || "";
            desc.style.textTransform = "capitalize";
            desc.style.marginTop = "4px";
            info.appendChild(desc);
        }

        const details = document.createElement("div");
        details.style.fontSize = "12px";
        details.style.color = "#666";
        const pop = (typeof hourData.pop === "number")
            ? Math.round(hourData.pop * 100) + "%"
            : "N/A";
        const wind = (hourData.wind_speed ?? 0) +
            " mph";
        details.textContent = `Precip: ${pop} · Wind: ${wind}`;
        details.style.marginTop = "4px";
        info.appendChild(details);

        block.appendChild(imgs);
        block.appendChild(info);
        container.appendChild(block);
    },
    /*
     * Collect clothes by temp and condition
     */
    chooseTopByTemp(tempF) {
        // choose top (ignore items tagged as 'bottoms' or supplemental)
        const top = this.clothing.find((c) =>
            !c.tags.includes("bottoms") &&
                c.tags.length === 0 === false
                ? false
                : !c.tags.includes("waterproof") &&
                    !c.tags.includes("windproof") &&
                    !c.tags.includes("bottoms") &&
                    tempF >= c.minTemp &&
                    tempF <= c.maxTemp
        );
        // fallback: find any non-bottom matching temp
        // const fallbackTop = this.clothing.find((c) =>
        //     !c.tags.includes("bottoms") &&
        //     tempF >= c.minTemp && tempF <= c.maxTemp &&
        //     !c.tags.includes("waterproof") &&
        //     !c.tags.includes("windproof")
        // );
        return top;
        // return top || fallbackTop ||
        //     this.clothing.find((c) => c.id === "default");
    },

    chooseBottomByTemp(tempF, supplements) {
        // prefer long pants if temp <= 68F or if rain/wind present
        const needsCoverage = tempF <= 68 ||
            supplements.some((s) =>
                s.tags &&
                (s.tags.includes("waterproof") ||
                    s.tags.includes("windproof"))
            );
        if (needsCoverage) {
            return this.clothing.find((c) => c.id === "long-pants");
        }
        // otherwise allow shorts if warm
        return this.clothing.find((c) => c.id === "shorts");
    },

    chooseSupplementals(hourData) {
        const supplements = [];
        const pop = (typeof hourData.pop === "number") ? hourData.pop : 0;
        const rainVol = hourData.rain &&
                (hourData.rain["1h"] ||
                    hourData.rain["1h"] === 0)
            ? hourData.rain["1h"]
            : 0;
        const windMph = hourData.wind_speed ?? 0;

        if (
            pop >= this.config.rainProbThreshold ||
            rainVol >= this.config.rainVolThreshold
        ) {
            const tempF = Math.round(hourData.temp);
            if (tempF <= 32) {
                supplements.push(
                    this.clothing.find((c) => c.id === "snow-pants"),
                );
            }
            if (tempF <= 60 && tempF > 32) {
                supplements.push(
                    this.clothing.find((c) => c.id === "raincoat"),
                );
            } else {supplements.push(
                    this.clothing.find((c) => c.id === "umbrella"),
                );}
        }

        if (windMph >= this.config.windSpeedThreshold) {
            supplements.push(
                this.clothing.find((c) => c.id === "jacket"),
            );
        }

        return supplements.filter(Boolean);
    },
    /* Schedule next update.
     * Delay number === milliseconds before next update. If empty, this.config.updateinterval is used.
     */
    scheduleUpdate: function (delay) {
        let nextLoad = this.config.updateInterval;
        if (typeof delay != "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        const self = this;
        setTimeout(function () {
            self.showOutfits();
        }, nextLoad);
    },

    /* showOutfits()
     * Main. Calls fetchHourlyForecast() and renderHourBlock() to render HTML content.
     */
    async showOutfits() {
        try {
            const data = await fetchHourlyForecast();
            const hourly = data.hourly || [];
            const current = data.current || hourly[0];

            const container = document.getElementById("wrapper");
            if (!container) return;
            container.innerHTML = "";

            if (current) {
                renderHourBlock(current, 0, true);
            }

            const maxAvailable = hourly.length;
            const toShow = Math.min(
                this.extendedHours,
                Math.max(0, maxAvailable - 1),
            );
            for (let i = 1; i <= toShow; i++) {
                const h = hourly[i];
                if (!h) break;
                renderHourBlock(h, false);
            }

            this.loaded = true;
            this.updateDom;
        } catch (err) {
            console.error(err);
            const container = document.getElementById(
                "wrapper",
            );
            if (container) {
                container.textContent = "Failed to load forecast.";
            }
        }
    },
});
