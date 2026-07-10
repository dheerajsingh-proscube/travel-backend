import express from "express";
import countryRoutes from "./routes/country.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import packageRoutes from "./routes/package.routes.js";
import upcomingRoutes from "./routes/upcomingTrips.routes.js";
import testimonialRoutes from "./routes/testimonials.routes.js";
import footerRoutes from "./routes/footer.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
// admin api import
import adminLoginRoute from "./routes/admin/auth.routes.js";
import dashboardRoute from "./routes/admin/dashboard.routes.js";
import adminCountryRoute from "./routes/admin/countriesManage.routes.js";
import adminDestinationRoute from "./routes/admin/destination.routes.js";
import adminCategoryRoute from "./routes/admin/category.routes.js";
import adminPackageRoute from "./routes/admin/package.routes.js";
import adminUpcomingTripRoute from "./routes/admin/upcomingTrips.routes.js";
import adminTestimonialsRoute from "./routes/admin/testimonials.routes.js";
import adminInquiryRoute from "./routes/admin/inquiry.routes.js"
import adminFooterRoute from "./routes/admin/footer.routes.js"

import cors from "cors";
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
  ],
  credentials: true,
}));

app.use(express.json());


app.use(
  "/api",
  countryRoutes,
  destinationRoutes,
  categoryRoutes,
  packageRoutes,
  upcomingRoutes,
  testimonialRoutes,
  footerRoutes,
  inquiryRoutes,
  adminLoginRoute,
  dashboardRoute,
  adminCountryRoute,
  adminDestinationRoute,
  adminCategoryRoute,
  adminInquiryRoute,
  adminFooterRoute,
  adminPackageRoute,
  adminUpcomingTripRoute,
  adminTestimonialsRoute,
);

export default app;
