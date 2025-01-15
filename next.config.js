/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [{
            hostname: "placehold.co"
        },
        {
            hostname: "eastindiapublishing.com"
        },
        {
            hostname: "preview.redd.it"
        },
        {
            hostname: "external-preview.redd.it"
        }
    ]
    }   
};

export default config;
