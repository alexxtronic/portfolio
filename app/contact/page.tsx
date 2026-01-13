import { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
    title: "Contact | Alexander D'Amore",
    description:
        "Get in touch with Alexander D'Amore. Let's discuss how I can help build AI-driven marketing systems for your business.",
};

export default function ContactPage() {
    return <ContactPageClient />;
}
