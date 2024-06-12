import { describe, expect, it } from 'vitest';
import { buildModelsTS, fieldToTypescript } from './model.service.js';
import type { NangoModel } from '@nangohq/types';

describe('buildModelTs', () => {
    it('should return empty (with sdk)', () => {
        const res = buildModelsTS({ parsed: { yamlVersion: 'v2', integrations: [], models: new Map() } });
        expect(res).toMatchSnapshot('');
    });

    it('should output all interfaces', () => {
        const models: NangoModel[] = [
            {
                name: 'Foo',
                fields: [
                    { name: '__string', value: 'string', tsType: true, dynamic: true },
                    { name: 'id', value: 'number', tsType: true }
                ]
            },
            {
                name: 'Bar',
                fields: [
                    { name: 'value', value: null, tsType: true },
                    { name: 'top', value: 'boolean', tsType: true, array: true },
                    { name: 'ref', value: 'Foo', tsType: false, model: true },
                    {
                        name: 'union',
                        union: true,
                        value: [
                            { name: '0', value: 'literal1' },
                            { name: '1', value: 'literal2' }
                        ],
                        tsType: false
                    },
                    {
                        name: 'array',
                        array: true,
                        value: [
                            { name: '0', value: 'arr1' },
                            { name: '1', value: 'arr2' }
                        ],
                        tsType: false
                    }
                ]
            }
        ];
        const res = buildModelsTS({
            parsed: {
                yamlVersion: 'v2',
                models: new Map(Object.entries(models)),
                integrations: []
            }
        });
        expect(res.split('\n').slice(0, 25)).toMatchSnapshot('');
    });
});

describe('fieldToTypescript', () => {
    it('should correctly interpret a string union literal type', () => {
        expect(
            fieldToTypescript({
                field: {
                    name: 'test',
                    union: true,
                    value: [
                        { name: '0', value: 'male' },
                        { name: '1', value: 'female' }
                    ]
                }
            })
        ).toStrictEqual("'male' | 'female'");
    });

    it('should correctly interpret a union literal type with all types', () => {
        expect(
            fieldToTypescript({
                field: {
                    name: 'test',
                    union: true,
                    value: [
                        { name: '0', value: 'male' },
                        { name: '1', value: 'string', tsType: true },
                        { name: '1', value: null, tsType: true },
                        { name: '2', value: undefined, tsType: true },
                        { name: '3', value: 1, tsType: true },
                        { name: '4', value: true, tsType: true }
                    ]
                }
            })
        ).toStrictEqual("'male' | string | null | undefined | 1 | true");
    });

    it('should correctly interpret a union literal with models', () => {
        expect(
            fieldToTypescript({
                field: {
                    name: 'test',
                    union: true,
                    value: [
                        { name: '0', value: 'User', model: true },
                        { name: '1', value: 'Account', model: true }
                    ]
                }
            })
        ).toStrictEqual('User | Account');
    });

    it('should correctly interpret a literal array', () => {
        expect(
            fieldToTypescript({
                field: {
                    name: 'test',
                    array: true,
                    value: [
                        { name: '0', value: 'User', model: true },
                        { name: '1', value: 'Account', model: true }
                    ]
                }
            })
        ).toStrictEqual('(User | Account)[]');
    });

    it('should correctly interpret a literal array', () => {
        expect(
            fieldToTypescript({
                field: {
                    name: 'test',
                    union: true,
                    value: [
                        { name: '0', value: 'User', model: true, array: true },
                        { name: '1', value: 'string', tsType: true }
                    ]
                }
            })
        ).toStrictEqual('User[] | string');
    });
});
