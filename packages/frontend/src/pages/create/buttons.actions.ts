import { CampaignFormValues } from './CampaignCreate';

/**  */
export interface FormStatus {
  page: {
    isFirstPage: boolean;
    isLastFormPage: boolean;
    isReview: boolean;
  };
  createAuthorized: boolean;
  shouldSimulate: boolean;
  canSimulate: boolean;
  mustSimulate: boolean;
  isSimulating: boolean;
  wasSimulated: boolean;
  canCreate: boolean;
  isCreating: boolean;
  isDeploying: boolean;
  hasErrors: boolean;
  wrongNetwork: boolean;
}

export interface Actions {
  validate: () => string[];
  setPageIx: (pageIx: number) => void;
  simulate: () => void;
  create: () => void;
  connect: () => void;
  switchNetwork: () => void;
}

const DEPLOY_CAMPAIGN_TEXT = 'Deploy Campaign';
const COMPUTING_SHARES_TEXT = `Computing shares`;

export const getButtonActions = (
  status: FormStatus,
  pageIx: number,
  actions: Actions
): { rightText: string; rightAction: () => void; rightDisabled: boolean } => {
  /** Sefault values */
  let rightAction: () => void = () => actions.setPageIx(pageIx + 1);
  let rightText: string = 'Continue';
  let rightDisabled: boolean = false;

  if (status.isCreating) {
    rightText = 'Creating';
    rightAction = () => {};
    rightDisabled = true;
  }

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
    rightDisabled = status.hasErrors;
  }

  // on the review page
  if (status.page.isReview) {
    if (!status.shouldSimulate) {
      /** should not simulate */
      if (status.canCreate) {
        /** Should not simulate and can create*/
        rightText = DEPLOY_CAMPAIGN_TEXT;
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
            if (!status.isSimulating) {
              /** should simulate, was not simulated, can simualte and must simulate */
              rightText = 'Calculate shares';
              rightAction = () => actions.simulate();
            } else {
              rightText = COMPUTING_SHARES_TEXT;
              rightAction = () => actions.simulate();
              rightDisabled = true;
            }
          } else {
            /** should simulate, was not simulated, can simualte but does not must simulate */
            rightText = DEPLOY_CAMPAIGN_TEXT;
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
              rightText = DEPLOY_CAMPAIGN_TEXT;
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
          rightText = DEPLOY_CAMPAIGN_TEXT;
          rightAction = () => actions.create();
        } else if (status.isSimulating) {
          rightText = COMPUTING_SHARES_TEXT;
          rightAction = () => actions.simulate();
          rightDisabled = true;
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
    rightText = COMPUTING_SHARES_TEXT;
    rightAction = () => {};
  }

  if (rightText === DEPLOY_CAMPAIGN_TEXT) {
    if (status.wrongNetwork) {
      rightText = `Switch Network`;
      rightAction = () => actions.switchNetwork();
    }

    if (!status.createAuthorized) {
      rightText = `Not Authorized`;
      rightAction = () => actions.switchNetwork();
      rightDisabled = true;
    }
  }

  return {
    rightText,
    rightAction,
    rightDisabled,
  };
};
