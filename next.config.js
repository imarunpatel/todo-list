/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        domains: ['links.papareact.com', 'firebasestorage.googleapis.com']
    }
}

module.exports = nextConfig
