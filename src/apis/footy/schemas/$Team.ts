/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Team = {
    properties: {
        id: {
            type: 'number',
            description: `Team ID`,
            isRequired: true,
        },
        original_id: {
            type: 'number',
            description: `Original team ID`,
        },
        name: {
            type: 'string',
            description: `Team name`,
            isRequired: true,
        },
        cleanName: {
            type: 'string',
            description: `Clean team name`,
        },
        english_name: {
            type: 'string',
            description: `English team name`,
        },
        shortHand: {
            type: 'string',
            description: `Short hand name`,
        },
        country: {
            type: 'string',
            description: `Country name`,
        },
        continent: {
            type: 'string',
            description: `Continent`,
        },
        image: {
            type: 'string',
            description: `Team image URL`,
        },
        season: {
            type: 'string',
            description: `Season`,
        },
        url: {
            type: 'string',
            description: `Team URL`,
        },
        stadium_name: {
            type: 'string',
            description: `Stadium name`,
        },
        stadium_address: {
            type: 'string',
            description: `Stadium address`,
        },
        table_position: {
            type: 'number',
            description: `Current table position`,
        },
        performance_rank: {
            type: 'number',
            description: `Performance rank`,
        },
        risk: {
            type: 'number',
            description: `Risk rating`,
        },
        season_format: {
            type: 'string',
            description: `Season format`,
        },
        competition_id: {
            type: 'number',
            description: `Competition ID`,
        },
        founded: {
            type: 'string',
            description: `Year founded`,
        },
        full_name: {
            type: 'string',
            description: `Full team name`,
        },
        alt_names: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        official_sites: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
