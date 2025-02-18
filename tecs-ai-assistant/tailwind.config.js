/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.jsx',
        './index.html'
    ],
    theme: {
        extend: {
            colors: {
                'citrus-blue': '#006298',
                'citrus-orange': '#f8991c', 
                'tecs-blue': '#44aadf'
            }
        },
    },
    plugins: [],
};

