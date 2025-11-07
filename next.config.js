/** @type {import('next').NextConfig} */

module.exports = {
    async headers() {
        return [
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, max-age=0',
                    },
                ],
            },
            {
                source: '/api/website/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization, Cookie',
                    },
                ],
            },
        ];
    },
    images: {
        domains: ["m.media-amazon.com", "res.cloudinary.com"]
    }
};
/** @type {import('next').NextConfig} */