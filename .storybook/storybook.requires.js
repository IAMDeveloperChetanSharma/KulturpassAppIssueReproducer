/* do not change this file, it is auto generated by storybook. */
import { decorators, parameters } from "./preview";
import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";
import "@storybook/addon-ondevice-actions/register";
import "@storybook/addon-ondevice-controls/register";
import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
  clearDecorators,
} from "@storybook/react-native";

global.STORIES = [
  {
    titlePrefix: "",
    directory: "./src",
    files: "**/*.stories.?(ts|tsx|js|jsx)",
    importPathMatcher:
      "^\\.[\\\\/](?:src(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$",
  },
];

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require("react-native").LogBox.ignoreLogs([
      "`clearDecorators` is deprecated and will be removed in Storybook 7.0",
    ]);
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators();
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

try {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return {
    "./src/components/alert/alert.stories.tsx": require("../src/components/alert/alert.stories.tsx"),
    "./src/components/button/button.stories.tsx": require("../src/components/button/button.stories.tsx"),
    "./src/components/e-mail-link/e-mail-link.stories.tsx": require("../src/components/e-mail-link/e-mail-link.stories.tsx"),
    "./src/components/favorite-button/favorite-button.stories.tsx": require("../src/components/favorite-button/favorite-button.stories.tsx"),
    "./src/components/form-fields/date-form-field.stories.tsx": require("../src/components/form-fields/date-form-field.stories.tsx"),
    "./src/components/form-fields/password-form-field.stories.tsx": require("../src/components/form-fields/password-form-field.stories.tsx"),
    "./src/components/form-fields/text-form-field.stories.tsx": require("../src/components/form-fields/text-form-field.stories.tsx"),
    "./src/components/html-text/html-text.stories.tsx": require("../src/components/html-text/html-text.stories.tsx"),
    "./src/components/info-box/info-box.stories.tsx": require("../src/components/info-box/info-box.stories.tsx"),
    "./src/components/link-text/link-text.stories.tsx": require("../src/components/link-text/link-text.stories.tsx"),
    "./src/components/list-item/list-item.stories.tsx": require("../src/components/list-item/list-item.stories.tsx"),
    "./src/components/loading-indicator/loading-indicator-overlay.stories.tsx": require("../src/components/loading-indicator/loading-indicator-overlay.stories.tsx"),
    "./src/components/modal-screen/modal-screen-header.stories.tsx": require("../src/components/modal-screen/modal-screen-header.stories.tsx"),
    "./src/components/screen/screen.stories.tsx": require("../src/components/screen/screen.stories.tsx"),
    "./src/components/svg-image/svg-image.stories.tsx": require("../src/components/svg-image/svg-image.stories.tsx"),
    "./src/components/tab-bar-icon/tab-bar-icon.stories.tsx": require("../src/components/tab-bar-icon/tab-bar-icon.stories.tsx"),
    "./src/components/try-again-button/try-again-button.stories.tsx": require("../src/components/try-again-button/try-again-button.stories.tsx"),
    "./src/features/eid-verification/components/pin-input.stories.tsx": require("../src/features/eid-verification/components/pin-input.stories.tsx"),
    "./src/features/eid-verification/screens/eid-can-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-can-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-change-pin-completion-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-change-pin-completion-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-new-pin-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-new-pin-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-nfc-not-supported-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-nfc-not-supported-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-pin-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-pin-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-puk-inoperative-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-puk-inoperative-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-puk-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-puk-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-transport-pin-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-transport-pin-screen.stories.tsx"),
    "./src/features/product-detail/stories/offer-selection-screen.stories.tsx": require("../src/features/product-detail/stories/offer-selection-screen.stories.tsx"),
    "./src/features/product-detail/stories/product-detail-screen.stories.tsx": require("../src/features/product-detail/stories/product-detail-screen.stories.tsx"),
    "./src/features/reservations/components/reservation-detail-header.stories.tsx": require("../src/features/reservations/components/reservation-detail-header.stories.tsx"),
    "./src/features/reservations/screens/reservation-detail-screen.stories.tsx": require("../src/features/reservations/screens/reservation-detail-screen.stories.tsx"),
    "./src/features/reservations/stories/reservations-list-empty.stories.tsx": require("../src/features/reservations/stories/reservations-list-empty.stories.tsx"),
    "./src/features/reservations/stories/reservations-list-item.stories.tsx": require("../src/features/reservations/stories/reservations-list-item.stories.tsx"),
    "./src/features/spartacus-webview/components/webview-error-view.stories.tsx": require("../src/features/spartacus-webview/components/webview-error-view.stories.tsx"),
    "./src/features/spartacus-webview/components/webview-loading-indicator.stories.tsx": require("../src/features/spartacus-webview/components/webview-loading-indicator.stories.tsx"),
    "./src/screens/favorites/favorites-list-item.stories.tsx": require("../src/screens/favorites/favorites-list-item.stories.tsx"),
    "./src/theme/typography.stories.tsx": require("../src/theme/typography.stories.tsx"),
  };
};

configure(getStories, module, false);
