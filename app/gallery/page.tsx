"use client";

import { useState } from "react";
import { Avatar, Badge, Chip, LabelTag } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Handoff } from "@/components/Handoff";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/motion/Reveal";
import { PickList } from "@/components/PickList";
import { RevealCard } from "@/components/RevealCard";
import { SectionHeading } from "@/components/Section";
import { SideScroll } from "@/components/SideScroll";
import { SiteShell } from "@/components/SiteShell";
import { Stepper } from "@/components/Stepper";
import { useSettings } from "@/lib/settings";
import { useToast } from "@/lib/toast";
import { avatarTone } from "@/lib/utils";

const PLAYERS = ["Dina", "Raka", "Sari", "Bima", "Yanti"];

export default function GalleryPage() {
  const { t } = useSettings();
  const { showToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chip, setChip] = useState("party");
  const [count, setCount] = useState(6);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <SiteShell tabbar={false}>
      <main className="container page" id="main">
        <Reveal className="page-header">
          <h1 className="page-header__title">{t("galleryTitle")}</h1>
          <p className="page-header__text">{t("gallerySubtitle")}</p>
        </Reveal>

        <section className="page-section" aria-labelledby="g-buttons">
          <SectionHeading title={t("galleryButtons")} id="g-buttons" />
          <div className="cluster">
            <Button icon="i-play">{t("start")}</Button>
            <Button variant="secondary" icon="i-users">
              {t("players")}
            </Button>
            <Button variant="ghost" icon="i-settings">
              {t("settings")}
            </Button>
            <Button variant="accent" icon="i-sparkle">
              {t("gallerySample")}
            </Button>
            <Button variant="danger" icon="i-close">
              {t("delete")}
            </Button>
            <Button disabled>{t("soonBadge")}</Button>
            <Button iconOnly round aria-label={t("settings")}>
              <Icon name="i-settings" />
            </Button>
          </div>
        </section>

        <section className="page-section" aria-labelledby="g-badges">
          <SectionHeading title={t("galleryBadges")} id="g-badges" />
          <div className="cluster">
            <Badge>{t("gallerySample")}</Badge>
            <Badge tone="success" icon="i-check">
              {t("levelEasy")}
            </Badge>
            <Badge tone="warning" icon="i-clock">
              {t("levelMedium")}
            </Badge>
            <Badge tone="error" icon="i-alert">
              {t("levelHard")}
            </Badge>
            <Badge tone="info" icon="i-info">
              {t("all")}
            </Badge>
            <Badge tone="new">{t("newBadge")}</Badge>
            <LabelTag>{t("partySocial")}</LabelTag>
            <LabelTag tone="sky">Sky</LabelTag>
            <LabelTag tone="grape">Grape</LabelTag>
          </div>
          <SideScroll className="chip-row" role="group" aria-label={t("galleryBadges")}>
            {["party", "kuis", "solo", "duo"].map((value) => (
              <Chip key={value} value={value} pressed={chip === value} onClick={() => setChip(value)}>
                {value}
              </Chip>
            ))}
          </SideScroll>
        </section>

        <section className="page-section" aria-labelledby="g-form">
          <SectionHeading title={t("galleryForm")} id="g-form" />
          <div className="panel">
            <div className="field">
              <label className="field__label" htmlFor="g-input">
                {t("playerName", { n: 1 })}
              </label>
              <input className="input" id="g-input" placeholder={t("playerPlaceholder", { n: 1 })} />
              <span className="field__hint">{t("playerNamesHint")}</span>
            </div>
            <div className="field">
              <span className="field__label" id="g-stepper">
                {t("playerCountLabel")}
              </span>
              <Stepper
                value={count}
                min={3}
                max={20}
                onChange={setCount}
                label="g-stepper"
                decreaseLabel={t("back")}
                increaseLabel={t("addPlayer")}
              />
            </div>
            <label className="toggle">
              {t("reduceMotion")}
              <input className="toggle__input" type="checkbox" role="switch" />
            </label>
            <div className="segmented" role="radiogroup" aria-label={t("theme")}>
              <label className="segmented__option">
                <input type="radio" name="g-theme" defaultChecked />
                <span>{t("themeLight")}</span>
              </label>
              <label className="segmented__option">
                <input type="radio" name="g-theme" />
                <span>{t("themeDark")}</span>
              </label>
            </div>
          </div>
        </section>

        <section className="page-section" aria-labelledby="g-feedback">
          <SectionHeading title={t("galleryFeedback")} id="g-feedback" />
          <div className="cluster">
            <Button onClick={() => showToast(t("galleryShowToast"), "success")}>
              {t("galleryShowToast")}
            </Button>
            <Button variant="ghost" onClick={() => setDialogOpen(true)}>
              {t("galleryDialog")}
            </Button>
          </div>
          <div className="alert" role="status">
            <Icon name="i-info" />
            <div className="alert__body">
              <span className="alert__title">{t("resumeTitle")}</span>
              <span>{t("resumeSafe")}</span>
            </div>
          </div>
        </section>

        <section className="page-section" aria-labelledby="g-players">
          <SectionHeading title={t("galleryPlayers")} id="g-players" />
          <div className="cluster">
            {PLAYERS.map((name, index) => (
              <span className="inline-actions" key={name}>
                <Avatar name={name} tone={avatarTone(name)} size={index === 0 ? "lg" : "sm"} ring={index === 0} />
                <span>{name}</span>
              </span>
            ))}
          </div>
          <PickList
            name="gallery-pick"
            legend={t("choosePlayer")}
            players={PLAYERS.map((name, index) => ({ id: `p${index}`, name }))}
            selectedId={picked}
            onSelect={setPicked}
          />
        </section>

        <section className="page-section" aria-labelledby="g-secret">
          <SectionHeading title={t("gallerySecret")} id="g-secret" />
          <RevealCard
            playerName="Dina"
            roleLabel={t("secretWord")}
            secret="Nasi Goreng"
            note={t("categoryLabel", { name: "Makanan" })}
            hint={t("holdToSee")}
          />
        </section>

        <section className="page-section" aria-labelledby="g-handoff">
          <SectionHeading title={t("screenHandoff")} id="g-handoff" />
          <Handoff
            name="Dina"
            hint={t("onlyCanSee", { name: "Dina" })}
            buttonLabel={t("imReady", { name: "Dina" })}
            onContinue={() => showToast(t("gallerySample"))}
          />
        </section>
      </main>

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={t("galleryDialog")}
        labelledBy="gallery-modal-title"
        actions={<Button onClick={() => setDialogOpen(false)}>{t("understood")}</Button>}
      >
        <p>{t("gallerySubtitle")}</p>
      </Modal>
    </SiteShell>
  );
}
