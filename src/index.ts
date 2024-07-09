import {
  AuthAccessCallback,
  AuthCallback,
  IPluginAuth,
  Logger,
  PackageAccess,
  PluginOptions,
  RemoteUser,
} from '@verdaccio/types';

import { getInternalError } from '@verdaccio/commons-api';
import { CustomConfig } from '../types/index';

/**
 * Custom Verdaccio Authenticate Plugin.
 */
export default class AuthCustomPlugin implements IPluginAuth<CustomConfig> {
  public logger: Logger;

  public constructor(_config: CustomConfig, options: PluginOptions<CustomConfig>) {
    this.logger = options.logger;

    return this;
  }
  /**
   * Authenticate an user.
   * @param user user to log
   * @param password provided password
   * @param cb callback function
   */
  public authenticate(user: string, password: string, cb: AuthCallback): void {
        cb(null, ['$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous']);
  }

  /**
   * Triggered on each access request
   * @param user
   * @param pkg
   * @param cb
   */
  public allow_access(user: RemoteUser, pkg: PackageAccess, cb: AuthAccessCallback): void {
    this.logger.debug({groups: user.groups}, 'user groups @{groups}');
    if (user.groups.some((group)=>pkg?.access?.includes(group))) {
      this.logger.debug({name: user.name}, 'your package has been granted for @{name}');
      cb(null, true)
    } else {
      this.logger.error({name: user.name}, '@{name} is not allowed to access this package');
       cb(getInternalError("error, try again"), false);
    }
  }

  /**
   * Triggered on each publish request
   * @param user
   * @param pkg
   * @param cb
   */
  public allow_publish(user: RemoteUser, pkg: PackageAccess, cb: AuthAccessCallback): void {
    this.logger.debug({groups: user.groups}, 'user groups @{groups}');
    if (user.groups.some((group)=>pkg?.publish?.includes(group))) {
      this.logger.debug({name: user.name}, '@{name} has been granted to publish');
      cb(null, true)
    } else {
      this.logger.error({name: user.name}, '@{name} is not allowed to publish this package');
       cb(getInternalError("error, try again"), false);
    }
  }

  public allow_unpublish(user: RemoteUser, pkg: PackageAccess, cb: AuthAccessCallback): void {
      this.logger.error({name: user.name}, '@{name} is not allowed to unpublish this package');
      cb(getInternalError("error, try again"), false);
  }
}
