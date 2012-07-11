/**
 * Defines the default implementation of an app's main delegate. Extend this
 * this class to handle the main application events.
 *
 * @class       
 * @author      Jay Phelps
 * @since       0.1
 */
CB.ApplicationDelegate = CB.Class.create({

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationDidFinishLaunching: CB.dummyFunction,

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationWillTerminate: CB.dummyFunction,

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationDidEnterBackground: CB.dummyFunction,

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationDidEnterForeground: CB.dummyFunction

});