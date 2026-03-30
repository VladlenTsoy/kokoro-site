/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "kokoro-app.ams3.cdn.digitaloceanspaces.com"
            },
            {
                protocol: "https",
                hostname: "static-maps.yandex.ru"
            }
        ]
    }
};

export default nextConfig;
