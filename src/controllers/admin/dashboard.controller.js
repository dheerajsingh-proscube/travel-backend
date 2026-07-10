import Package from "../../models/package.model.js";
import Inquiry from "../../models/inquiry.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalPackages,
            publishedPackages,
            draftPackages,
            domesticPackages,
            internationalPackages,
            totalEnquiries,
            allInquiries,
            contactMessages,
        ] = await Promise.all([
            // Total Packages
            Package.countDocuments(),

            // Published Packages
            Package.countDocuments({
                status: "published",
            }),

            // Draft Packages
            Package.countDocuments({
                status: "draft",
            }),

            // Domestic Packages
            Package.countDocuments({
                category: "domestic",
            }),

            // International Packages
            Package.countDocuments({
                category: "international",
            }),

            // Total Package Enquiries
            Inquiry.countDocuments(),

            Inquiry.find({
                type: 'inquiry'
            }),

            // Total Contact Messages
            Inquiry.countDocuments({
                type: "contact",
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully.",
            stats: {
                totalPackages: {
                    total: totalPackages,
                    published: publishedPackages,
                    drafts: draftPackages,
                    domestic: domesticPackages,
                    international: internationalPackages,
                },

                allInquiries,

                totalEnquiries,

                contactMessages,
            },
        });
    } catch (err) {
        console.error("Dashboard Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
