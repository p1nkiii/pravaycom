import Link from 'next/link'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Impressum</h1>
        
        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information according to § 5 TMG</h2>
            <p className="leading-relaxed">
              Pravay
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="leading-relaxed">
              Email: <a href="mailto:hellopravay@gmail.com" className="text-sky-500 hover:text-sky-600 transition-colors">hellopravay@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liability for Content</h2>
            <p className="leading-relaxed">
              As a service provider, we are responsible for our own content on these pages in accordance with general legislation. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
            </p>
            <p className="leading-relaxed mt-4">
              Obligations to remove or block the use of information in accordance with general legislation remain unaffected. However, liability in this regard is only possible from the point in time at which knowledge of a specific infringement of the law is obtained. Upon becoming aware of corresponding legal violations, we will remove this content immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liability for Links</h2>
            <p className="leading-relaxed">
              Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this third-party content. The respective provider or operator of the pages is always responsible for the content of the linked pages.
            </p>
            <p className="leading-relaxed mt-4">
              The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of an infringement. Upon becoming aware of legal violations, we will remove such links immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Copyright</h2>
            <p className="leading-relaxed">
              The content and works created by the site operators on these pages are subject to copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.
            </p>
            <p className="leading-relaxed mt-4">
              Downloads and copies of this page are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-sky-500 hover:text-sky-600 transition-colors font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

