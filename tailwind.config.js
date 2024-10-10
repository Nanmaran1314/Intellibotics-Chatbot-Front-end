module.exports = {
    content: [
      "./src/**/*.{js,}",
    ],
    theme: {
      extend: {},
    },
    corePlugins: {
        preflight: false, // Disables Tailwind base styles globally
      },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }