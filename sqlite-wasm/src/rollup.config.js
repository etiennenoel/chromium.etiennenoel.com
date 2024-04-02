import cleanup from "rollup-plugin-cleanup";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
    {
        input: 'dist/esm/index.js',
        output: {
            dir: 'public_html/scripts',
            format: 'esm',
            exports: "auto",
            compact: true,
        },
        plugins: [
            json(),
            nodeResolve({
                preferBuiltins: true,
            }),
        ]
    },
    {
        input: 'dist/esm/page_without_sqlite.js',
        output: {
            dir: 'public_html/scripts',
            format: 'esm',
            exports: "auto",
            compact: true,
        },
        plugins: [
            json(),
            nodeResolve({
                preferBuiltins: true,
            }),
        ]
    }
]