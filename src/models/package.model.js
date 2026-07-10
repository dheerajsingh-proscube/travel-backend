import mongoose from "mongoose";

const { Schema } = mongoose;

/* ---------------- Sub Schemas ---------------- */

const ItinerarySchema = new Schema(
  {
    day: Number,
    title: String,
    desc: String,
    meals: String,
    stay: String,
  },
  { _id: false }
);

const HotelSchema = new Schema(
  {
    city: String,
    hotel: String,
    category: String,
    nights: String,
  },
  { _id: false }
);

const PricingTierSchema = new Schema(
  {
    tier: String,
    landOnlyNum: Number,
    fullPkgNum: Number,
    landOnly: Number,
    fullPackage: Number,
    details: String,
  },
  { _id: false }
);

const BatchSchema = new Schema(
  {
    dateRange: String,
    status: String,
    priceOffset: Number,
  },
  { _id: false }
);

const CancellationSchema = new Schema(
  {
    timing: String,
    fee: String,
  },
  { _id: false }
);

const PackItemSchema = new Schema(
  {
    category: String,
    items: [String],
  },
  { _id: false }
);

const FAQSchema = new Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

/* ---------------- Data Schema ---------------- */

const PackageDataSchema = new Schema(
  {
    duration: String,
    destinations: String,
    tripType: String,
    departureCities: String,
    groupSize: String,
    bestSeason: String,
    country: String,
    hotelCategory: String,
    flights: String,
    visa: String,
    mealsIncluded: String,
    transfers: String,

    price: String,
    mrp: String,
    discountText: String,
    depositToBook: String,
    rating: String,
    reviews: String,

    description: String,
    about: String,
    whyBook: String,

    highlights: [String],

    itinerary: [ItinerarySchema],

    hotels: [HotelSchema],

    inclusions: [String],
    exclusions: [String],

    pricingTiersList: [PricingTierSchema],

    batches: [BatchSchema],

    paymentSchedule: [String],

    cancellationPolicy: [CancellationSchema],

    amendments: [String],

    forceMajeure: [String],

    whatToPack: [PackItemSchema],

    faqs: [FAQSchema],

    trustSignals: [String],

    seoTitle: String,
    seoDescription: String,
    aeoSnippet: String,
  },
  { _id: false }
);

/* ---------------- Main Package Schema ---------------- */

const packageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["domestic", "international"],
      required: true,
    },

    packageType: {
      type: String,
      enum: ["package", "upcoming-trip"],
      default: "package",
    },

    subCategory: [String],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    is_featured: {
      type: Boolean,
      default: false,
    },

    sort_order: {
      type: Number,
      default: 0,
    },

    main_image_url: String,

    video_url: String,

    image_urls: [String],

    price_num: Number,

    destination_slugs: [String],

    data: PackageDataSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Package", packageSchema);