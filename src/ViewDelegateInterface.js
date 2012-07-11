/**
 * No documentation available yet.
 *
 * @interface
 * @author      Jay Phelps
 * @since       0.1
 */
CB.ViewDelegateInterface = CB.Interface.create({

    loadView:           Function,
    viewDidLoad:        Function,
    viewWillRender:     Function,
    viewDidRender:      Function,
    viewWillAppear:     Function,
    viewDidAppear:      Function,
    viewWillDisappear:  Function,
    viewDidDisappear:   Function

});