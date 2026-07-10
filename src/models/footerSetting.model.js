import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    sections: [
      {
        title: {
          type: String,
          required: true,
        },

        links: [
          {
            label: {
              type: String,
              required: true,
            },

            href: {
              type: String,
              required: true,
            },

            external: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Footer = mongoose.model("FooterSetting", footerSchema);

export default Footer;