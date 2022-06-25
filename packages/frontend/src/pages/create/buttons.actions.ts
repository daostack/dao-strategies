/**  */
export interface FormStatus {
  page: {
    isFirstPage: boolean;
    isLastFormPage: boolean;
    isReview: boolean;
  };
  shouldSimulate: boolean;
  canSimulate: boolean;
  mustSimulate: boolean;
  isSimulating: boolean;
  wasSimulated: boolean;
  canCreate: boolean;
}

export interface Actions {
  validate: () => string[];
  setPageIx: (pageIx: number) => void;
  simulate: () => void;
  create: () => void;
  connect: () => void;
}

export const getButtonActions = (
  status: FormStatus,
  pageIx: number,
  actions: Actions
): { rightText: string; rightAction: () => void; rightDisabled: boolean } => {
  /** Sefault values */
  let rightAction: () => void = () => actions.setPageIx(pageIx + 1);
  let rightText: string = 'Continue';
  let rightDisabled: boolean = false;

  /** Special values */
  if (status.page.isLastFormPage) {
    rightText = 'Review';
    rightAction = () => {
      const errors = actions.validate();
      if (errors.length === 0) {
        actions.setPageIx(pageIx + 1);
        if (status.shouldSimulate && status.canSimulate) {
          actions.simulate();
        }
      }
    };
  }

  // on the review page
  if (status.page.isReview) {
    if (!status.shouldSimulate) {
      /** should not simulate */
      if (status.canCreate) {
        /** Should not simulate and can create*/
        rightText = `Deploy Campaign`;
        rightAction = () => actions.create();
      } else {
        /** Should not simulate and can't create*/
        rightText = `Connect Wallet to Deploy`;
        rightAction = () => actions.connect();
      }
    } else {
      /** should simulate */
      if (!status.wasSimulated) {
        /** was not simulated */
        if (status.canSimulate) {
          /** can simulate */
          if (status.mustSimulate) {
            /** should simulate, was not simulated, can simualte and must simulate */
            rightText = 'Calculate rewards';
            rightAction = () => actions.simulate();
          } else {
            /** should simulate, was not simulated, can simualte but does not must simulate */
            rightText = 'Deploy Campaign';
            rightAction = () => actions.create();
          }
        } else {
          /** cannot simulate */
          if (status.mustSimulate) {
            /** should simulate, was not simulated, cannot simulate and must simulate */
            rightText = 'Connect Wallet';
            rightAction = () => actions.connect();
          } else {
            if (status.canCreate) {
              /** Should not simulate and can create*/
              rightText = `Deploy Campaign`;
              rightAction = () => actions.create();
            } else {
              /** Should not simulate and can't create*/
              rightText = `Connect Wallet to Deploy`;
              rightAction = () => actions.connect();
            }
          }
        }
      } else {
        /** was simulated */
        if (status.canCreate) {
          /** should simulate, was simulated, can create */
          rightText = `Deploy Campaign`;
          rightAction = () => actions.create();
        } else {
          /** should simulate, was simulated, cannot create */
          rightText = `Connect Wallet to Deploy`;
          rightAction = () => actions.connect();
        }
      }
    }
  }

  /** overwrite */
  if (status.isSimulating) {
    rightText = `Computing rewards`;
    rightAction = () => {};
  }

  return {
    rightText,
    rightAction,
    rightDisabled,
  };
};
