import { NextFunction, Request, Response } from 'express';
import { ServiceManager } from '../service.manager';

import { Controller } from './Controller';

export class SocialApiController extends Controller {
  constructor(manager: ServiceManager) {
    super(manager);
  }

  /** */
  async searchGithub(
    request: Request,
    _response: Response,
    _next: NextFunction
  ): Promise<string[]> {
    /* eslint-disable */
    return this.manager.services.socialApi.searchGithub(
      request.body.what,
      request.body.query,
      request.body.page,
      request.body.per_page
    );
    /* eslint-enable */
  }

  async repoIsValid(
    request: Request,
    _response: Response,
    _next: NextFunction
  ): Promise<boolean> {
    /* eslint-disable */
    return this.manager.services.socialApi.repoIsValid(request.query.fullName);
    /* eslint-enable */
  }
}
