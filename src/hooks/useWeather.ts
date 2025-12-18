"use client";

import { useEffect, useState, useTransition } from "react";
import z from "zod";

const ForecastSchema = z.object({

    shortForecast: z.string(),
    temperature: z.number(),
    temperatureUnit: z.string(),
    icon: z.url()

});

export type Forecast = z.infer<typeof ForecastSchema>;

async function fetchGridOfCoordinates(latitude: number, longitude: number)
{
    const req = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, { next: { revalidate: 3600 } });
    
    const JSON = await req.json();
    const gridX = JSON.properties.gridX as number;
    const gridY = JSON.properties.gridY as number;

    return { gridX, gridY };
}

async function fetchShortForecast(gridX: number, gridY: number)
{
    const req = await fetch(`https://api.weather.gov/gridpoints/LOT/${gridX},${gridY}/forecast?units=us`, { next: { revalidate: 3600 } });
    
    const JSON = await req.json();
    const currentForecast = JSON.properties.periods[0];
    const shortForecast = currentForecast.shortForecast;
    const temperature = currentForecast.temperature;
    const temperatureUnit = currentForecast.temperatureUnit;
    const icon = currentForecast.icon;
    
    return ForecastSchema.parse({ shortForecast, temperature, temperatureUnit, icon });
}

export default function useWeather(latitude: number, longitude: number)
{
    const [ forecast, setForecast ] = useState<Forecast>();
    const [ lookupError, setLookupError ] = useState<string>();
    const [ isPending, startLookup ] = useTransition();

    useEffect(() => {

        startLookup(async () => {

            try
            {
                const { gridX, gridY } = await fetchGridOfCoordinates(latitude, longitude);
                const forecast = await fetchShortForecast(gridX, gridY);
            
                setForecast(forecast);
            }
            catch (error)
            {
                setLookupError(`${error}`);
            }

        });

    }, [ longitude, latitude ]);

    return { forecast, isPending, error: lookupError };
}