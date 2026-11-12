"use client";

import Link from "next/link";
import { m } from "motion/react";
import { Icon } from "@/components/Icon";
import { LinkButton } from "@/components/Button";
import { MOTION_EASE, Reveal, itemDelay } from "@/components/motion/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { useSettings } from "@/lib/settings";

const LEAKS = [
  { icon: "i-hand", key: "leak1" as const },
  { icon: "i-eye-off", key: "leak2" as const },
  { icon: "i-pause", key: "leak3" as const },
  { icon: "i-users", key: "leak4" as const },
];

const FAQ = [
  { q: "faq1Q" as const, a: "faq1A" as const },
  { q: "faq2Q" as const, a: "faq2A" as const },
  { q: "faq3Q" as const, a: "faq3A" as const },
  { q: "faq4Q" as const, a: "faq4A" as const },
  { q: "faq5Q" as const, a: "faq5A" as const },
  { q: "faq6Q" as const, a: "faq6A" as const },
];

export default function HowToPage() {
  const { t } = useSettings();
  return (
    <SiteShell tabbar={false}>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("howToTitle")}</h1>
          <p className="page-header__text">{t("howToSubtitle")}</p>
        </Reveal>

        <section className="page-section--tight" aria-label={t("howToShort")}>
          <ol className="steps">
            {(
              [
                { title: "howToStep1Title", text: "howToStep1Text" },
                { title: "howToStep2Title", text: "howToStep2Text" },
                { title: "howToStep3Title", text: "howToStep3Text" },
              ] as const
            ).map((step, index) => (
              <m.li
                className="card step"
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.45, delay: itemDelay(index), ease: MOTION_EASE }}
              >
                <span className="step__num" aria-hidden="true" />
                <h2 className="card__title">{t(step.title)}</h2>
                <p className="card__text">{t(step.text)}</p>
              </m.li>
            ))}
          </ol>
        </section>

        <Reveal as="section" className="page-section panel" labelledBy="leak-title">
          <h2 className="panel__title" id="leak-title">
            {t("leakTitle")}
          </h2>
          <ul className="role-list">
            {LEAKS.map((item) => (
              <li className="role" key={item.key}>
                <span className="menu-list__icon">
                  <Icon name={item.icon} />
                </span>
                <span className="role__body">{t(item.key)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <section className="page-section" id="faq" aria-labelledby="faq-title">
          <div className="section-heading">
            <div className="section-heading__text">
              <h2 className="section-heading__title" id="faq-title">
                {t("faqTitle")}
              </h2>
            </div>
          </div>
          <Reveal>
            <div className="accordion">
              {FAQ.map((item, index) => (
                <details className="accordion__item" key={item.q} open={index === 0}>
                  <summary className="accordion__summary">
                    {t(item.q)}
                    <Icon name="i-chevron-down" />
                  </summary>
                  <div className="accordion__content">
                    <p>
                      {t(item.a)}{" "}
                      {item.q === "faq6Q" ? (
                        <Link className="link" href="/privacy">
                          {t("readPrivacy")}
                        </Link>
                      ) : null}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        <Reveal as="section" className="page-section panel" labelledBy="cta-title">
          <h2 className="panel__title" id="cta-title">
            {t("readyTitle")}
          </h2>
          <p className="panel__text">{t("readyText")}</p>
          <div className="cluster">
            <LinkButton href="/games" size="lg" icon="i-play">
              {t("pickGame")}
            </LinkButton>
            <Link className="link" href="/privacy">
              {t("readPrivacy")}
            </Link>
          </div>
        </Reveal>
      </main>
    </SiteShell>
  );
}
