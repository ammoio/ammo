/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  UserController: {
    '*':      false,
    add:      ['isLoggedIn', 'isSelf'],
    findOne:  true,
    populate: ['isLoggedIn', 'isSelf'],
    remove:   ['isLoggedIn', 'isSelf'],
    update:   ['isLoggedIn', 'isSelf']
  },

  PlaylistController: {
    '*':      false,
    addSong:  ['isLoggedIn', 'isPlaylistOwner'],
    create:   ['isLoggedIn'],
    destroy:  ['isLoggedIn', 'isPlaylistOwner'],
    findOne:  true,
    populate: ['isLoggedIn', 'isPlaylistOwner'],
    remove:   ['isLoggedIn', 'isPlaylistOwner'],
    update:   ['isLoggedIn', 'isPlaylistOwner']
  },

  SongController: {
    '*':        false,
    create:     ['isLoggedIn'],
    createSong: ['isLoggedIn'],
    findOne:    true
  },

  AuthController: {
    '*':            false,
    facebookLogin:  true,
    me:             ['isLoggedIn']
  }
};
