import { NextFunction, Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';

import { ServiceManager } from '../service.manager';
import { LoggedUserDetails } from '../services/UserService';

import { Controller } from './Controller';

export class UserController extends Controller {
  constructor(manager: ServiceManager) {
    super(manager);
  }

  /** */
  async me(
    request: Request,
    _response: Response,
    _next: NextFunction,
    loggedUser: string | undefined
  ): Promise<LoggedUserDetails | undefined> {
    /* eslint-disable */
    if (!request.session.siwe) {
      return undefined;
    }

    /* eslint-enable */
    return loggedUser
      ? this.manager.services.user.getVerified(loggedUser)
      : undefined;
  }

  nonce(
    request: Request,
    _response: Response,
    _next: NextFunction
  ): { nonce: string } {
    const nonce = generateNonce();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.session.nonce = nonce;
    return { nonce };
  }

  async verify(
    request: Request,
    _response: Response,
    _next: NextFunction
  ): Promise<{ valid: boolean; user?: LoggedUserDetails }> {
    try {
      /* eslint-disable */
      const reqMessage = request.body?.message as string | undefined;
      const reqSig = request.body?.signature as string | undefined;
      const reqNonce = request.session.nonce as string | undefined;
      /* eslint-enable */

      if (reqMessage === undefined || reqSig === undefined) {
        throw new Error('Expected message and signature in body');
      }

      const message = new SiweMessage(reqMessage);
      const fields = await message.validate(reqSig);

      if (fields.nonce !== reqNonce) {
        throw new Error(
          `Invalid nonce message: ${fields.nonce} vs session: ${reqNonce}`
        );
      }

      /* eslint-disable */
      request.session.siwe = fields;
      request.session.cookie.expires = new Date(fields.expirationTime);
      return {
        valid: true,
        user: await this.manager.services.user.getVerified(fields.address),
      };
    } catch (e) {
      request.session.siwe = null;
      request.session.nonce = null;
      console.error(e);

      return { valid: false };
      /* eslint-enable */
    }
  }

  logout(request: Request, _response: Response, _next: NextFunction): void {
    /* eslint-disable */
    if (request.session) {
      request.session.destroy();
    }
    /* eslint-enable */
  }

  verifyGithubOfAddress(
    request: Request,
    _response: Response,
    _next: NextFunction
  ): Promise<{ address: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.manager.services.user.verifyGithubOfAddress(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.body.signature as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.body.github_username as string
    );
  }

  verifyAddressOfGithub(
    request: Request,
    _response: Response,
    _next: NextFunction,
    loggedUser: string
  ): Promise<{ address: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.manager.services.user.verifyAddressOfGithub(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.body.handle as string,
      loggedUser
    );
  }
}
