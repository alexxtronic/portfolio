import { Metadata } from "next";
import { WorkPageClient } from "./WorkPageClient";

export const metadata: Metadata = {
    title: "Work | Alexander D'Amore",
    description:
        "Case studies and projects from Alexander D'Amore - AI & Marketing Specialist. See how I've helped Fortune 500s and startups build systems that scale.",
};

export default function WorkPage() {
    return <WorkPageClient />;
}
