// tailwind.config.js
plugins: [
  function ({ addVariant }) {
    addVariant('autofill', '&:-webkit-autofill');
  }
]
