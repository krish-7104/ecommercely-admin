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
        ];
    },
    images: {
        domains: ["m.media-amazon.com", "res.cloudinary.com"]
    }
};
/** @type {import('next').NextConfig} */