"use client";

import BackgroundVideo from "./components/BackgroundVideo";
import RippleCanvas from "./components/RippleCanvas";
import { Bodoni_Moda, Open_Sans } from "next/font/google";
import { motion } from "framer-motion";

/* Didone / high-contrast serif – luxury editorial feel (similar to Bodoni/Didot “grande” samples) */
const bodoniHero = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal"],
  display: "swap",
});

const gentleSpring = {
  type: "spring",
  damping: 42,
  stiffness: 62,
  mass: 1.25,
};

const slowEase = {
  duration: 1.35,
  ease: [0.22, 1, 0.36, 1],
};

const FluidStone = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ ...gentleSpring, delay }}
  >
    {children}
  </motion.div>
);

const WHY_CHOOSE = [
  {
    title: "Global Expertise",
    body: "We aren’t just agents; we are explorers. Every destination we recommend is hand-picked and vetted for quality.",
  },
  {
    title: "Insider Rates",
    body: "Thanks to our direct partnerships with airlines and hotels worldwide, we secure deals you won't find on standard booking engines.",
  },
  {
    title: "24/7 Peace of Mind",
    body: "Flight delays? Last-minute changes? We’ve got your back. From takeoff to touchdown, you are never traveling alone.",
  },
  {
    title: "Tailor-Made Travel",
    body: 'We don’t believe in "one size fits all." We listen to your vision and build a custom itinerary that fits your rhythm and your budget.',
  },
];

const BOOKED_TRIPS = [
  {
    destination: "Lapland, Finland",
    style: "Family Adventure",
    highlights:
      "Snowmobile safaris, glass igloo stays, and Northern Lights hunting.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Snowy northern landscape under northern lights in Lapland",
  },
  {
    destination: "Tokyo & Kyoto",
    style: "Urban Honeymoon",
    highlights:
      "A blend of neon skyscrapers and ancient tea ceremonies in boutique luxury.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Neon city skyline at night evoking Tokyo",
  },
  {
    destination: "Zanzibar",
    style: "Premium Escape",
    highlights:
      "All-inclusive beachfront resorts, private reef diving, and spice farm tours.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Tropical beach with turquoise water",
  },
  {
    destination: "The Swiss Alps",
    style: "Ski & Snowboard",
    highlights:
      "All-in-one packages: Flights, gear, passes, and the best après-ski spots.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Snow-covered mountain ridge above clouds",
  },
];

export default function Page() {
  return (
    <div className="relative bg-sea-salt">
      <section className="relative min-h-[100svh] overflow-hidden">
        <BackgroundVideo />
        <RippleCanvas fillParent />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-6 pb-20 pt-20 md:px-10 lg:px-14 [&_h1]:drop-shadow-[0_2px_28px_rgba(248,250,252,0.92)] [&_header_p]:drop-shadow-[0_1px_14px_rgba(248,250,252,0.88)] [&_header_span]:drop-shadow-[0_1px_10px_rgba(248,250,252,0.85)]">
          <header className="flex flex-col items-center gap-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={gentleSpring}
              className={`${openSans.className} flex flex-wrap items-center justify-center gap-8 text-[10px] font-semibold uppercase not-italic tracking-[0.38em] text-soft-slate md:text-[11px]`}
            >
              <span className="transition-colors duration-[1400ms] hover:text-deep-ocean">
                Global
              </span>
              <span className="h-px w-10 bg-soft-slate/40" aria-hidden="true" />
              <span className="transition-colors duration-[1400ms] hover:text-deep-ocean">
                Trusted
              </span>
              <span className="h-px w-10 bg-soft-slate/40" aria-hidden="true" />
              <span className="transition-colors duration-[1400ms] hover:text-deep-ocean">
                Tailor-made
              </span>
            </motion.div>

            <FluidStone className="max-w-4xl space-y-8">
              <h1
                className={`${bodoniHero.className} max-w-[24ch] text-pretty text-4xl font-normal lowercase leading-[1.06] tracking-[-0.04em] text-neutral-950 antialiased sm:text-5xl md:text-6xl lg:text-[4.65rem] lg:leading-[1.02]`}
              >
                the world is calling{" "}
                <span className="text-neutral-900/85">– let us take you there.</span>
              </h1>
              <p
                className={`${openSans.className} text-lg font-medium not-italic tracking-[0.06em] text-deep-ocean/90 md:text-xl`}
              >
                Your next adventure starts here.
              </p>
              <p
                className={`${openSans.className} mx-auto max-w-2xl text-base font-normal not-italic leading-relaxed text-soft-slate md:text-lg`}
              >
                From budget-friendly flights to bucket-list experiences, we don’t just book
                trips—we craft lifelong memories.
              </p>
              <div className="flex justify-center pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={gentleSpring}
                  className={`${openSans.className} rounded-full border border-deep-ocean/15 bg-white/40 px-8 py-3 text-xs font-semibold uppercase not-italic tracking-[0.28em] text-deep-ocean shadow-[0_20px_60px_rgba(30,58,138,0.08)] backdrop-blur-sm transition-colors duration-[1400ms] hover:bg-white/70`}
                >
                  Start planning
                </motion.button>
              </div>
            </FluidStone>
          </header>
        </div>
      </section>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-24 px-6 pb-40 pt-16 md:gap-32 md:px-10 lg:px-14">
        <section aria-labelledby="why-heading" className="space-y-12">
          <FluidStone className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-soft-slate">
              Why travelers trust us
            </p>
            <h2
              id="why-heading"
              className="font-serif text-4xl text-deep-ocean md:text-5xl"
            >
              Why Choose Us?
            </h2>
            <p className="text-base leading-relaxed text-soft-slate md:text-lg">
              In a world of endless search results, we provide the clarity and expertise you
              need. Here’s why travelers trust us:
            </p>
          </FluidStone>

          <div className="grid gap-8 sm:grid-cols-2">
            {WHY_CHOOSE.map((item, i) => (
              <FluidStone key={item.title} delay={0.06 * i}>
                <div className="h-full rounded-[28px] border border-deep-ocean/10 bg-white/55 p-8 shadow-[0_24px_70px_rgba(30,58,138,0.06)] backdrop-blur-md md:p-10">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-soft-slate">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl text-deep-ocean md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-soft-slate md:text-base">
                    {item.body}
                  </p>
                </div>
              </FluidStone>
            ))}
          </div>
        </section>

        <section aria-labelledby="trips-heading" className="space-y-10">
          <FluidStone className="space-y-4 text-center md:text-left">
            <p className="text-[11px] uppercase tracking-[0.28em] text-soft-slate">
              Recently Booked Trips
            </p>
            <h2 id="trips-heading" className="font-serif text-4xl text-deep-ocean md:text-5xl">
              Real Journeys for Real Travelers.
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-soft-slate md:mx-0 md:text-lg">
              Take a look at some of the incredible getaways we’ve recently organized for our
              clients:
            </p>
          </FluidStone>

          <div className="grid gap-8 sm:grid-cols-2">
            {BOOKED_TRIPS.map((row, i) => (
              <FluidStone key={row.destination} delay={0.06 * i}>
                <article className="group relative aspect-square w-full overflow-hidden rounded-[28px] border border-deep-ocean/10 shadow-[0_30px_90px_rgba(30,58,138,0.12)]">
                  <img
                    src={row.image}
                    alt={row.imageAlt}
                    width={1600}
                    height={1600}
                    loading="eager"
                    decoding="async"
                    fetchPriority={i >= 2 ? "high" : "auto"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-ocean/95 via-deep-ocean/45 to-deep-ocean/15"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-left md:p-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/80">
                      {row.style}
                    </p>
                    <h3 className="font-serif text-2xl leading-tight text-white md:text-3xl">
                      {row.destination}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/88 md:text-base">
                      {row.highlights}
                    </p>
                  </div>
                </article>
              </FluidStone>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="contact-heading"
          className="rounded-[32px] border border-deep-ocean/10 bg-gradient-to-br from-white/80 via-white/55 to-sky-50/30 p-8 shadow-[0_35px_90px_rgba(30,58,138,0.10)] backdrop-blur-md md:p-12"
        >
          <FluidStone className="space-y-10">
            <div className="text-center md:text-left">
              <p className="text-[11px] uppercase tracking-[0.28em] text-soft-slate">
                Contact
              </p>
              <h2
                id="contact-heading"
                className="mt-3 font-serif text-4xl text-deep-ocean md:text-5xl"
              >
                Let’s plan your next trip
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-soft-slate md:mx-0 md:text-lg">
                Tell us your dates, dream destinations, and budget—we’ll reply with ideas,
                options, and next steps. Prefer email or phone? Either works.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="space-y-6 rounded-[24px] border border-deep-ocean/10 bg-white/70 p-8 shadow-[0_20px_60px_rgba(30,58,138,0.06)]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-soft-slate">
                    Email
                  </p>
                  <a
                    href="mailto:hello@studio.example"
                    className="mt-2 block text-lg font-medium text-deep-ocean underline-offset-4 transition-colors hover:text-deep-ocean/80 hover:underline"
                  >
                    hello@studio.example
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-soft-slate">
                    Phone
                  </p>
                  <a
                    href="tel:+15550000000"
                    className="mt-2 block text-lg font-medium text-deep-ocean underline-offset-4 transition-colors hover:text-deep-ocean/80 hover:underline"
                  >
                    +1 (555) 000-0000
                  </a>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-6 rounded-[24px] border border-deep-ocean/10 bg-white/70 p-8 shadow-[0_20px_60px_rgba(30,58,138,0.06)]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-soft-slate">
                    Hours
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-soft-slate">
                    Monday–Friday, 9:00–18:00 (your timezone).{" "}
                    <span className="text-deep-ocean/80">
                      24/7 support applies once your trip is booked.
                    </span>
                  </p>
                </div>
                <motion.a
                  href="mailto:hello@studio.example?subject=New%20trip%20inquiry"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={gentleSpring}
                  className="inline-flex w-full items-center justify-center rounded-full border border-deep-ocean/20 bg-deep-ocean px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-[0_18px_50px_rgba(30,58,138,0.25)] transition-colors hover:bg-deep-ocean/90 md:w-auto"
                >
                  Send a message
                </motion.a>
              </div>
            </div>
          </FluidStone>
        </section>

        <footer className="flex flex-col items-center gap-6 pb-10 pt-4 text-center text-soft-slate">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={slowEase}
            className="text-[11px] uppercase tracking-[0.28em]"
          >
            Crafted journeys worldwide
          </motion.div>
          <p className="max-w-md text-sm leading-relaxed text-soft-slate/90">
            © {new Date().getFullYear()} Your travel studio. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
