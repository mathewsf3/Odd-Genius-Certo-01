/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $League = {
    properties: {
        name: {
            type: 'string',
            description: `Name of the league`,
            isRequired: true,
        },
        season: {
            type: 'array',
            contains: {
                type: 'Season',
            },
            isRequired: true,
        },
    },
} as const;
