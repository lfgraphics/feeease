/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['v5.airtableusercontent.com', 'source.unsplash.com', 'unsplash.com', 'images.unsplash.com', 'blogger.googleusercontent.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jahannuma.vercel.app',
                port: '',
                pathname: '/metaimages/**',
            },
        ],
    },
};

export default nextConfig;