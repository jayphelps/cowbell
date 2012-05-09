/**
 * Defines the default implementation of an app's main delegate. Extend this
 * this class to handle the main application events.
 *
 * @class       
 * @author      Jay Phelps
 * @since       0.1
 */
ML.ApplicationDelegate = ML.Class.create({

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationDidFinishLaunching: ML.dummyFunction,

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationWillTerminate: ML.dummyFunction,

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationDidEnterBackground: ML.dummyFunction,

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */
    applicationDidEnterForeground: ML.dummyFunction

});