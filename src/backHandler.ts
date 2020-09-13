let appBackHandler: (() => any) | undefined;
let networkLoggerBackHandler: (() => void) | undefined;

export const setBackHandler = (backHandler?: () => void) => {
  networkLoggerBackHandler = backHandler;
};

const goBack = () => {
  if (networkLoggerBackHandler) {
    return networkLoggerBackHandler();
  }
  appBackHandler?.();
};

export const backHandlerSet = () => {
  return !!appBackHandler;
};

/**
 * Get a replacement back handler to use instead of your default navigation so you
 * can use your existing back button to navigate inside the network logger.
 *
 * If navigation has occurred in the logger app then pressing your back handler will
 * navigate internally. If it is already on the default page then it will call your
 * original back handler.
 *
 * e.g.
 *
 * const navigation = useNavigation()
 *
 * const onBack = getBackHandler(navigation.goBack)
 *
 * <Button onPress={onBack} title="Go back" />
 *
 * @param backHandler App navigation default back handler
 */
export const getBackHandler = (backHandler: () => any) => {
  appBackHandler = backHandler;

  return goBack;
};
