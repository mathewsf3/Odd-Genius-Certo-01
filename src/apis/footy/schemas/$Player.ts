/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Player = {
    properties: {
        id: {
            type: 'number',
            description: `Player ID`,
            isRequired: true,
        },
        name: {
            type: 'string',
            description: `Player name`,
            isRequired: true,
        },
        position: {
            type: 'string',
            description: `Player position`,
        },
        age: {
            type: 'number',
            description: `Player age`,
        },
        nationality: {
            type: 'string',
            description: `Player nationality`,
        },
        team_id: {
            type: 'number',
            description: `Current team ID`,
        },
        goals_overall: {
            type: 'number',
            description: `Total goals scored this season`,
        },
    },
} as const;
