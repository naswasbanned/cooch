"use client";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/motion/Reveal";
import { PlayerRow } from "@/components/PlayerRow";
import { Stepper } from "@/components/Stepper";
import { useSettings } from "@/lib/settings";

export function PlayersPanel({
  names,
  min,
  max,
  onCountChange,
  onNameChange,
  onRemove,
  onShuffle,
}: {
  names: string[];
  min: number;
  max: number;
  onCountChange: (count: number) => void;
  onNameChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onShuffle: () => void;
}) {
  const { t } = useSettings();
  return (
    <Reveal as="section" className="panel" labelledBy="p-title" y={12}>
      <h2 className="panel__title" id="p-title">
        {t("playerSection")}
      </h2>
      <div className="field">
        <span className="field__label" id="lbl-players">
          {t("playerCountLabel")}
        </span>
        <Stepper
          value={names.length}
          min={min}
          max={max}
          onChange={onCountChange}
          label="lbl-players"
          decreaseLabel={t("removePlayer")}
          increaseLabel={t("addPlayer")}
        />
        <span className="field__hint">{t("playerRange", { min, max })}</span>
      </div>
      <div className="field">
        <span className="field__label">{t("playerNames")}</span>
        <span className="field__hint">{t("playerNamesHint")}</span>
      </div>
      <div className="player-list">
        {names.map((name, index) => (
          <PlayerRow
            key={index}
            index={index + 1}
            name={name}
            placeholder={t("playerPlaceholder", { n: index + 1 })}
            label={t("playerName", { n: index + 1 })}
            onChange={(value) => onNameChange(index, value)}
            onRemove={() => onRemove(index)}
            canRemove={names.length > min}
            removeLabel={t("removePlayer")}
          />
        ))}
      </div>
      <div className="cluster">
        <Button
          variant="ghost"
          icon="i-plus"
          disabled={names.length >= max}
          onClick={() => onCountChange(names.length + 1)}
        >
          {t("addPlayer")}
        </Button>
        <Button variant="ghost" icon="i-shuffle" onClick={onShuffle}>
          {t("shuffleOrder")}
        </Button>
      </div>
    </Reveal>
  );
}
