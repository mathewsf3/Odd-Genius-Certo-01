/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiResponse = {
    properties: {
        success: {
            type: 'boolean',
            description: `Whether the request was successful`,
            isRequired: true,
        },
        data: {
            type: 'array',
            contains: {
                properties: {
                },
            },
            isRequired: true,
        },
    },
} as const;
