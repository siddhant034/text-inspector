import * as Tooltip from "@radix-ui/react-tooltip";

type Theme = "light" | "dark";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Text Inspector home">
          <span className="wordmark-icon">ti</span>
          <span>text inspector</span>
        </a>
        <div className="topbar-actions">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="privacy-note privacy-trigger" type="button">
                <span className="status-dot" /> Your text stays in this browser
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="privacy-tooltip" sideOffset={8}>
                Text analysis happens locally. Nothing is uploaded or stored by a server.
                <Tooltip.Arrow className="privacy-tooltip-arrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </header>
    </Tooltip.Provider>
  );
}
