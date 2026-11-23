import type { ReactNode } from "react";

import { Card, EmptyState, Screen } from "@/design-system";
import { t } from "@/i18n";

/** Temporary tab content until the tab's phase lands (see SPEC.md §8). */
export function PlaceholderScreen({ title, phase, children }: { title: string; phase: string; children?: ReactNode }) {
  return (
    <Screen title={title} tabBarSpacing>
      <Card>
        <EmptyState title={t("placeholder.title", { name: title })} message={t("placeholder.builtIn", { phase })} />
      </Card>
      {children}
    </Screen>
  );
}
