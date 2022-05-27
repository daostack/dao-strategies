import { NextFunction, Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import { LoggedUserDetails } from '../services/UserService';

import { Services } from '../types';

import { Controller } from './Controller';

export class UserController extends Controller {
  constructor(services: Services) {
    super(services);
  }

  /** */
  async me(
    request: Request,
    _response: Response,
    _next: NextFunction
  ): Promise<LoggedUserDetails | undefined> {
    /* eslint-disable */
    if (!request.session.siwe) {
      return undefined;
    }
    const address = request.session.siwe.address;
    const user = await this.services.user.get(address);
    return { address: user.address, verified: { github: user.github } };
    /* eslint-enable */
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

      /** If signature is valid, add or create user */
      const user = await this.services.user.getOrCreate({
        address: fields.address,
      });

      /* eslint-disable */
      request.session.siwe = fields;
      request.session.cookie.expires = new Date(fields.expirationTime);
      return {
        valid: true,
        user: {
          address: user.address,
          verified: { github: user.github },
        },
      };
    } catch (e) {
      request.session.siwe = null;
      request.session.nonce = null;
      console.error(e);

      return { valid: false };
      /* eslint-enable */
    }
  }
}
