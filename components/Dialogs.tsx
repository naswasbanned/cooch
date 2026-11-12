"use client";

import { useSettings } from "@/lib/settings";
import type { GameMeta, WerewolfRole } from "@/lib/types";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

export function RulesDialog({
  open,
  onClose,
  game,
}: {
  open: boolean;
  onClose: () => void;
  game: GameMeta;
}) {
  const { t, pickText } = useSettings();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t("howToPlay")} ${pickText(game.name)}`}
      labelledBy="rules-modal-title"
      actions={<Button onClick={onClose}>{t("understood")}</Button>}
    >
      <ol className="role-list">
        {game.steps.map((step, index) => (
          <li className="role" key={index}>
            <Badge>{index + 1}</Badge>
            <div className="role__body">
              <span className="role__name">{pickText(step.title)}</span>
              <span className="text-muted">{pickText(step.text)}</span>
            </div>
          </li>
        ))}
      </ol>
      <ul className="role-list">
        {game.rules.map((rule, index) => (
          <li className="role" key={index}>
            <span className="menu-list__icon">
              <Icon name="i-sparkle" />
            </span>
            <span className="role__body">{pickText(rule)}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

export function PauseDialog({
  open,
  onResume,
  onRules,
  onRestart,
  onExit,
  onRoles,
  onAlive,
  onPeek,
}: {
  open: boolean;
  onResume: () => void;
  onRules: () => void;
  onRestart: () => void;
  onExit: () => void;
  onRoles?: () => void;
  onAlive?: () => void;
  onPeek?: () => void;
}) {
  const { t } = useSettings();
  return (
    <Modal
      open={open}
      onClose={onResume}
      title={t("pauseTitle")}
      labelledBy="pause-modal-title"
    >
      <p className="field__hint">{t("pauseHint")}</p>
      <ul className="menu-list">
        <li className="menu-list__item">
          <button className="menu-list__link" type="button" onClick={onResume}>
            <span className="menu-list__icon">
              <Icon name="i-play" />
            </span>
            <span className="menu-list__text">{t("resumeGame")}</span>
          </button>
        </li>
        {onAlive ? (
          <li className="menu-list__item">
            <button className="menu-list__link" type="button" onClick={onAlive}>
              <span className="menu-list__icon">
                <Icon name="i-users" />
              </span>
              <span className="menu-list__text">{t("aliveTitle")}</span>
              <Icon name="i-chevron-right" />
            </button>
          </li>
        ) : null}
        {onPeek ? (
          <li className="menu-list__item">
            <button className="menu-list__link" type="button" onClick={onPeek}>
              <span className="menu-list__icon">
                <Icon name="i-eye" />
              </span>
              <span className="menu-list__text">{t("peekRole")}</span>
              <Icon name="i-chevron-right" />
            </button>
          </li>
        ) : null}
        {onRoles ? (
          <li className="menu-list__item">
            <button className="menu-list__link" type="button" onClick={onRoles}>
              <span className="menu-list__icon">
                <Icon name="i-eye" />
              </span>
              <span className="menu-list__text">{t("seeAllRoles")}</span>
            </button>
          </li>
        ) : null}
        <li className="menu-list__item">
          <button className="menu-list__link" type="button" onClick={onRules}>
            <span className="menu-list__icon">
              <Icon name="i-help" />
            </span>
            <span className="menu-list__text">{t("gameRules")}</span>
            <Icon name="i-chevron-right" />
          </button>
        </li>
        <li className="menu-list__item">
          <button className="menu-list__link" type="button" onClick={onRestart}>
            <span className="menu-list__icon">
              <Icon name="i-shuffle" />
            </span>
            <span className="menu-list__text">{t("restartGame")}</span>
          </button>
        </li>
        <li className="menu-list__item">
          <button
            className="menu-list__link menu-list__link--danger"
            type="button"
            onClick={onExit}
          >
            <span className="menu-list__icon">
              <Icon name="i-logout" />
            </span>
            <span className="menu-list__text">{t("endGame")}</span>
          </button>
        </li>
      </ul>
    </Modal>
  );
}

export function ExitDialog({
  open,
  onCancel,
  onExit,
}: {
  open: boolean;
  onCancel: () => void;
  onExit: () => void;
}) {
  const { t } = useSettings();
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t("endGameTitle")}
      labelledBy="exit-modal-title"
      actions={
        <>
          <Button variant="ghost" onClick={onCancel} autoFocus>
            {t("cancelKeepPlaying")}
          </Button>
          <Button variant="danger" onClick={onExit}>
            {t("endGame")}
          </Button>
        </>
      }
    >
      <p>{t("endGameText")}</p>
    </Modal>
  );
}

export function HostRolesDialog({
  open,
  onClose,
  players,
  roleLabel,
}: {
  open: boolean;
  onClose: () => void;
  players: Array<{ id: string; name: string; role: WerewolfRole | string; alive: boolean }>;
  roleLabel: (role: string) => string;
}) {
  const { t } = useSettings();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("moderatorTitle")}
      labelledBy="host-roles-title"
      actions={<Button onClick={onClose}>{t("understood")}</Button>}
    >
      <p className="field__hint">{t("moderatorHintShort")}</p>
      <ol className="rank-list">
        {players.map((player) => (
          <li key={player.id} className={player.alive ? "rank-row" : "rank-row rank-row--out"}>
            <span className="rank-row__pos" />
            <span className="rank-row__name">{player.name}</span>
            <Badge tone={player.role === "wolf" ? "error" : "info"}>{roleLabel(player.role)}</Badge>
          </li>
        ))}
      </ol>
    </Modal>
  );
}
