/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaginatedResponse = {
    type: 'all-of',
    contains: [{
        type: 'ApiResponse',
    }, {
        properties: {
            pager: {
                type: 'Pager',
            },
        },
    }],
} as const;
