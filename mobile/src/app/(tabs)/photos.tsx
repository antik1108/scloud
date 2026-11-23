import { Screen } from "@/design-system";
import { PhotosAccessCard } from "@/features/photos/PhotosAccessCard";
import { t } from "@/i18n";

export default function PhotosTab() {
  return (
    <Screen title={t("tabs.photos")} tabBarSpacing>
      <PhotosAccessCard />
    </Screen>
  );
}
