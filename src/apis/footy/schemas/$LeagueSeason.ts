/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeagueSeason = {
    properties: {
        id: {
            type: 'string',
            description: `Season ID`,
            isRequired: true,
        },
        division: {
            type: 'string',
            description: `Division`,
        },
        name: {
            type: 'string',
            description: `League name`,
            isRequired: true,
        },
        shortHand: {
            type: 'string',
            description: `Short hand name`,
        },
        country: {
            type: 'string',
            description: `Country name`,
        },
        type: {
            type: 'string',
            description: `League type`,
        },
        iso: {
            type: 'string',
            description: `Country ISO code`,
        },
        continent: {
            type: 'string',
            description: `Continent`,
        },
        image: {
            type: 'string',
            description: `League image URL`,
        },
        image_thumb: {
            type: 'string',
            description: `League thumbnail URL`,
        },
        url: {
            type: 'string',
            description: `League URL`,
        },
        parent_url: {
            type: 'string',
            description: `Parent URL`,
        },
        countryURL: {
            type: 'string',
            description: `Country URL`,
        },
        tie_break: {
            type: 'string',
            description: `Tie break method`,
        },
        domestic_scale: {
            type: 'string',
            description: `Domestic importance scale`,
        },
        international_scale: {
            type: 'string',
            description: `International importance scale`,
        },
        clubNum: {
            type: 'number',
            description: `Number of clubs`,
        },
        year: {
            type: 'string',
            description: `Season year`,
        },
        season: {
            type: 'string',
            description: `Season description`,
        },
        starting_year: {
            type: 'string',
            description: `Starting year`,
        },
        ending_year: {
            type: 'string',
            description: `Ending year`,
        },
        no_home_away: {
            type: 'boolean',
            description: `Whether league has no home/away distinction`,
        },
        seasonClean: {
            type: 'string',
            description: `Clean season description`,
        },
    },
} as const;
