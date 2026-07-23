export const DESIGN_PRESETS = {

    classic: {

        name: "Classic",

        design: {

            typography: {
                heading: "Cormorant Garamond",
                body: "Cormorant Garamond",
                accent: "Cormorant Garamond",
            },

            colors: {
                accent: "#C7A56A",
                overlay: 0.25,
                paper: "#fffdf9",
                text: "#222",
                textLight: "#666",
                border: "#e7e2d9",
            },

            paper: {
                width: "normal",
                texture: "classic",
            },

            countdown: {
                style: "classic",
            },

            opening: {
                style: "fade",
            },

            animations: {
                style: "fade",
            },

        },

    },

    minimalist: {

        name: "Minimal",

        design: {

            typography: {
                heading: "Libre Baskerville",
                body: "Lora",
                accent: "Parisienne",
            },

            colors: {
                accent: "#A18B63",
                overlay: 0.18,
                paper: "#ffffff",
                text: "#222",
                textLight: "#666",
                border: "#ECE7DF",
            },

            paper: {
                width: "normal",
                texture: "cotton",
            },

            countdown: {
                style: "minimal",
            },

            opening: {
                style: "fade",
            },

            animations: {
                style: "fade",
            },

        },

    },

    luxury: {

        name: "Luxury",

        design: {

            typography: {
                heading: "Cinzel",
                body: "Libre Baskerville",
                accent: "Great Vibes",
            },

            colors: {
                accent: "#D4AF37",
                overlay: 0.35,
                paper: "#FAF6EC",
                text: "#1A1A1A",
                textLight: "#555",
                border: "#D8C89A",
            },

            paper: {
                width: "wide",
                texture: "linen",
            },

            countdown: {
                style: "luxury",
            },

            opening: {
                style: "wax",
            },

            animations: {
                style: "fade",
            },

        },

    },

} as const;