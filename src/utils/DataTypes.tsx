// Description: This file contains the data types that are used in the app.
// old types:
// export const DataTypes = ['Air Quality Index', 'CO2 Concentration', 'CO Concentration', 'Temperature', 'Humidity', 'VOC Concentration'];
// export const DataTypesShort = ['AQI', 'CO2', 'CO', 'Temp', 'Humidity', 'VOC'];
// export const DataTypeSymbols = ['aq', 'co2', 'co', 'temp', 'hum', 'voc'];
// export const DataTypeUnits = ['AQI', 'ppm', 'ppm', '°C', 'g/m^3', 'kOhms'];

// new types:
export const DataTypes = ['PM 2.5', 'PM 10.0', 'PM 100', 'CO2 Concentration', 'Temperature', 'Humidity', 'VOC Concentration'];
export const DataTypesShort = ['PM 2.5', 'PM 10.0', 'PM 100', 'CO2', 'Temp', 'Humidity', 'VOC'];
export const DataTypeSymbols = ['pm25', 'pm10', 'pm100', 'co2', 'temp', 'hum', 'voc'];
export const DataTypeUnits = ['µg/m^3', 'µg/m^3', 'µg/m^3', 'ppm', '°C', 'g/m^3', 'kOhms'];

// export const SortDate = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 365 Days'];

export type DataType = {
    aq?: number,
    co2?: number,
    co?: number,
    temp?: number,
    hum?: number,
    voc?: number,
    pm25?: number,
    pm10?: number,
    pm100?: number,
};

export type thresholdType = {
    good: number,
    moderate: number,
    unhealthy: number,
    veryUnhealthy: number,
    hazardous: number,
};

export const defaultThresholds = {
    aq: {
        good: 50,
        moderate: 100,
        unhealthy: 150,
        veryUnhealthy: 200,
        hazardous: 300,
    } satisfies thresholdType,
    co2: {
        good: 1000,
        moderate: 2000,
        unhealthy: 5000,
        veryUnhealthy: 10000,
        hazardous: 20000,
    } satisfies thresholdType,
    co: {
        good: 9,
        moderate: 35,
        unhealthy: 70,
        veryUnhealthy: 140,
        hazardous: 200,
    } satisfies thresholdType,
    temp: {
        good: 20,
        moderate: 25,
        unhealthy: 30,
        veryUnhealthy: 35,
        hazardous: 40,
    } satisfies thresholdType,
    hum: {
        good: 40,
        moderate: 50,
        unhealthy: 60,
        veryUnhealthy: 70,
        hazardous: 80,
    } satisfies thresholdType,
    voc: {
        good: 0.5,
        moderate: 1,
        unhealthy: 2,
        veryUnhealthy: 4,
        hazardous: 8,
    } satisfies thresholdType,
    pm25: {
        good: 10,
        moderate: 20,
        unhealthy: 30,
        veryUnhealthy: 40,
        hazardous: 50,
    } satisfies thresholdType,
    pm10: {
        good: 10,
        moderate: 20,
        unhealthy: 30,
        veryUnhealthy: 40,
        hazardous: 50,
    } satisfies thresholdType,
    pm100: {
        good: 10,
        moderate: 20,
        unhealthy: 30,
        veryUnhealthy: 40,
        hazardous: 50,
    } satisfies thresholdType,
};

// returns the name of the threshold based on the threshold value and the type of data
export const getNameFromThreshold = (threshold: number, type: string) => {
    // console.log(defaultThresholds[type as keyof typeof defaultThresholds]);
    // console.log(type);
    if (!type) return undefined;
    if (!defaultThresholds[type as keyof typeof defaultThresholds]) return undefined;
    // console.log(defaultThresholds[type as keyof typeof defaultThresholds]);
    // get the keys of the object
    const keys = Object.keys(defaultThresholds[type as keyof typeof defaultThresholds]);

    // find the first key that is greater than the threshold
    const index = keys.findIndex((key) => threshold <= defaultThresholds[type as keyof typeof defaultThresholds][key as keyof thresholdType]);
    // const name = keys[index] ? keys[index] : 'good';
    // return (keys[index] ? keys[index] : keys[0]) as string;
    return keys[index] ? keys[index] : undefined;
};