/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Pager = {
    properties: {
        current_page: {
            type: 'number',
            description: `Current page number`,
            isRequired: true,
        },
        max_page: {
            type: 'number',
            description: `Maximum page number`,
            isRequired: true,
        },
        results_per_page: {
            type: 'number',
            description: `Number of results per page`,
            isRequired: true,
        },
        total_results: {
            type: 'number',
            description: `Total number of results`,
            isRequired: true,
        },
    },
} as const;
