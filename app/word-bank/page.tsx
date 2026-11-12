"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button, LinkButton } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { MOTION_EASE, Reveal, itemDelay } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/Section";
import { SiteShell } from "@/components/SiteShell";
import { useSettings } from "@/lib/settings";
import { WORD_CATEGORIES } from "@/lib/words";

export default function WordBankPage() {
  const { t, pickText } = useSettings();
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();

  const categories = useMemo(() => {
    return WORD_CATEGORIES.map((category) => {
      const categoryMatches = [category.name.id, category.name.en]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      const words =
        normalized && !categoryMatches
          ? category.words.filter((word) =>
              [word.word.id, word.word.en].join(" ").toLowerCase().includes(normalized),
            )
          : category.words;
      return { ...category, words };
    }).filter((category) => !normalized || category.words.length > 0);
  }, [normalized]);

  const shownWords = categories.reduce((sum, category) => sum + category.words.length, 0);

  return (
    <SiteShell>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("wordBankTitle")}</h1>
          <p className="page-header__text">{t("wordBankSubtitle")}</p>
        </Reveal>

        <Reveal as="section" className="page-section--tight panel" labelledBy="word-bank-search">
          <div className="field">
            <label className="field__label" htmlFor="word-bank-query" id="word-bank-search">
              {t("wordBankSearch")}
            </label>
            <div className="input-wrap">
              <Icon name="i-search" />
              <input
                className="input"
                id="word-bank-query"
                type="search"
                placeholder={t("wordBankPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <div className="cluster">
            <Badge icon="i-sparkle">
              {t("wordBankCount", { categories: categories.length, words: shownWords })}
            </Badge>
            {query ? (
              <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                {t("resetFilter")}
              </Button>
            ) : null}
          </div>
        </Reveal>

        <section className="page-section" aria-label={t("wordBankTitle")}>
          {categories.length ? (
            <div className="accordion">
              {categories.map((category, index) => (
                <m.details
                  className="accordion__item"
                  key={category.id}
                  open={index === 0 || Boolean(normalized) ? true : undefined}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.4, delay: itemDelay(index), ease: MOTION_EASE }}
                >
                  <summary className="accordion__summary">
                    <span>{pickText(category.name)}</span>
                    <span className="cluster">
                      <Badge>{t("wordBankWords", { n: category.words.length })}</Badge>
                      <Icon name="i-chevron-down" />
                    </span>
                  </summary>
                  <div className="accordion__content">
                    <div className="cluster">
                      {category.words.map((word) => (
                        <Badge key={word.id}>{pickText(word.word)}</Badge>
                      ))}
                    </div>
                  </div>
                </m.details>
              ))}
            </div>
          ) : (
            <EmptyState
              art="/art/empty-cards.svg"
              title={t("wordBankEmptyTitle")}
              text={t("wordBankEmptyText")}
              action={
                <Button variant="ghost" onClick={() => setQuery("")}>
                  {t("resetFilter")}
                </Button>
              }
            />
          )}
        </section>

        <Reveal as="section" className="page-section panel" labelledBy="word-bank-custom">
          <h2 className="panel__title" id="word-bank-custom">
            {t("wordBankCustomTitle")}
          </h2>
          <p className="panel__text">{t("wordBankNote")}</p>
          <div className="cluster">
            <LinkButton href="/settings" icon="i-plus">
              {t("wordBankCustomCta")}
            </LinkButton>
            <Link className="link" href="/play/impostor/setup">
              {t("wordBankSetupCta")}
            </Link>
          </div>
        </Reveal>
      </main>
    </SiteShell>
  );
}
