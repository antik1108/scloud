/** English copy. Keys are grouped by feature; add other locales with the same shape. */
export const en = {
  common: {
    continue: "Continue",
    cancel: "Cancel",
    openSettings: "Open Settings",
    comingSoon: "Coming soon",
  },
  tabs: {
    photos: "Photos",
    magicAI: "Magic AI",
    videos: "Videos",
    settings: "Settings",
    new: "NEW",
  },
  splash: {
    wordmark: "Lumio",
  },
  welcome: {
    eyebrow: "Welcome to",
    title: "Lumio",
    tagline: "AI portrait studio in your pocket",
    ratingOutOf: "/5",
    ratingsCount: "{{count}} ratings",
    joinUsers: "Join {{count}} users",
    joinUsersSubtitle: "who create with Lumio",
    featureRetouch: "Retouch portraits in one tap",
    featureMagic: "Turn selfies into AI styles",
    featureVideo: "Edit photos and videos together",
    getStarted: "Get Started",
    legalPrefix: "By continuing to use Lumio, you agree to the",
    privacyPolicy: "Privacy Policy",
    and: "and",
    termsOfUse: "Terms of Use",
  },
  permissions: {
    photos: {
      title: "Add Photo for Editing",
      message: "Allow access to Photos to start editing.",
      action: "Choose Photo",
      blockedMessage: "Photo access is turned off. Turn it on in Settings to start editing.",
      limitedMessage: "Lumio can see only the photos you selected.",
      manageAccess: "Manage access",
      grantedMessage: "Your photo library will appear here.",
    },
    camera: {
      blockedMessage: "Camera access is turned off. Turn it on in Settings to take a selfie.",
    },
    notifications: {
      blockedMessage: "Notifications are turned off. Turn them on in Settings to know when your portraits are ready.",
    },
  },
  placeholder: {
    title: "{{name}} is coming",
    builtIn: "Built in {{phase}}",
  },
} as const;

/** Widen literal string types so other locales can provide different text with the same keys. */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dictionary = Widen<typeof en>;
