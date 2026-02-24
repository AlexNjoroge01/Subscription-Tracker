// JSON-LD Structured Data for SEO
// This component adds structured data to pages for better search engine visibility

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function OrganizationJsonLd({
  name = "SubTrack",
  url = "https://subtrack.app",
  logo = "https://subtrack.app/logo.png",
  description = "Track and manage your subscriptions with elegance. Get renewal reminders, analyze spending patterns, and save money.",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs: [
      "https://twitter.com/subtrack",
      "https://linkedin.com/company/subtrack",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebApplicationJsonLdProps {
  name?: string;
  url?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

export function WebApplicationJsonLd({
  name = "SubTrack",
  url = "https://subtrack.app",
  description = "Track and manage your subscriptions with elegance. Get renewal reminders, analyze spending patterns, and save money.",
  applicationCategory = "FinanceApplication",
  operatingSystem = "Web",
  offers = { price: "0", priceCurrency: "USD" },
}: WebApplicationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
    featureList: [
      "Subscription tracking",
      "Renewal reminders",
      "Spending analytics",
      "Budget management",
      "Category organization",
      "Family member tracking",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQJsonLdProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Common FAQ for the homepage
export function HomepageFAQJsonLd() {
  const faqs = [
    {
      question: "What is SubTrack?",
      answer: "SubTrack is a subscription tracking and budget management app that helps you monitor all your recurring payments in one place. It sends renewal reminders, analyzes your spending patterns, and helps you save money.",
    },
    {
      question: "Is SubTrack free to use?",
      answer: "Yes, SubTrack offers a free Starter plan that includes basic subscription tracking, renewal reminders, and spending analytics. Premium plans are available for advanced features.",
    },
    {
      question: "How do I track my subscriptions?",
      answer: "Simply add your subscriptions with details like name, amount, billing cycle, and next billing date. SubTrack will automatically track them and send you reminders before renewals.",
    },
    {
      question: "Can I track subscriptions for my whole family?",
      answer: "Yes, SubTrack allows you to assign subscriptions to family members, making it easy to track and manage household subscriptions in one place.",
    },
    {
      question: "Does SubTrack support different currencies?",
      answer: "Yes, SubTrack supports multiple currencies including KES, USD, EUR, GBP, and more. You can set your preferred currency in your account settings.",
    },
  ];

  return <FAQJsonLd questions={faqs} />;
}
