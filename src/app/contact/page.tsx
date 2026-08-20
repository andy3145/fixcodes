import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us — FixCodeDB',
    description: 'Get in touch with the FixCodeDB team for feedback, corrections, or support.',
};

export default function ContactPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="text-gray-700 mb-4">
                Have questions about an appliance error code, found an error in a diagnostic step, or want to get in touch? We would love to hear from you.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                <h2 className="text-lg font-semibold mb-2">Email Support</h2>
                <p className="text-gray-600">
                    You can reach our team directly at:{' '}
                    <a href="mailto:support@fixcodedb.com" className="text-blue-600 underline font-medium">
                        support@fixcodedb.com
                    </a>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    (Replace with your active support email address)
                </p>
            </div>
            <p className="text-sm text-gray-500">
                We typically review feedback and messages within 24 to 48 hours.
            </p>
        </main>
    );
}
