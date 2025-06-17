/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Referee = {
    properties: {
        id: {
            type: 'number',
            description: `Referee ID`,
            isRequired: true,
        },
        name: {
            type: 'string',
            description: `Referee name`,
            isRequired: true,
        },
        nationality: {
            type: 'string',
            description: `Referee nationality`,
        },
        matches_officiated: {
            type: 'number',
            description: `Number of matches officiated`,
        },
    },
} as const;
