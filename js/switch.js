const switchUIController = (() => {
    const DOMStrings = {
        monthSwitch: '#month-switch',
        yearSwitch: '#year-switch',
        monthCalendar: '.month-calendar',
        yearCalendar: '.year-calendar',
        mCalBox: '.month-box',
        myCalBox: '.month-of-year',
    };

    const selector = (elem) => document.querySelector(elem);

    const classAction = (el, action, classValue) => {
        selector(el).classList[action](classValue);
    };
    const setStyle = (el, prop, value) => {
        selector(el).style[prop] = value;
    };

    return {
        preset() {
            classAction(DOMStrings.yearSwitch, 'add', 'switch-on');
            setStyle(DOMStrings.yearCalendar, 'display', 'flex');
            setStyle(DOMStrings.monthCalendar, 'display', 'none');
            setStyle(DOMStrings.myCalBox, 'transform', 'translateY(0)');
        },

        switchCal({ on, off }) {
            const [{ switchBtnOn, calendarOn, animOn }, { switchBtnOff, calendarOff, animOff }] = [on, off];
            classAction(switchBtnOn, 'add', 'switch-on');
            classAction(switchBtnOff, 'remove', 'switch-on');
            setStyle(calendarOn, 'display', 'flex');
            setStyle(calendarOff, 'display', 'none');
            // setStyle(animOn, 'transform', 'translateY(0)');
            // setStyle(animOff, 'transform', 'translateY(20px)');
        },

        getDOMStrings: () => DOMStrings,
        getSelector: (elem) => selector(elem),
    };
})();

const switchController = ((UICtrl) => {
    const DOM = UICtrl.getDOMStrings();
    const select = (elem) => UICtrl.getSelector(elem);
    const setupEventListeners = () => {
        const event = (elem, ev, value) => select(elem).addEventListener(ev, value);

        // Switch between month and year
        event(DOM.monthSwitch, 'click', switchCal);
        event(DOM.yearSwitch, 'click', switchCal);
    };

    const switchCal = (ev) => {
        UICtrl.switchCal(ev.target.id === 'month-switch' ? {
            on: {
                switchBtnOn: DOM.monthSwitch,
                calendarOn: DOM.monthCalendar,
                animOn: DOM.mCalBox,
            },
            off: {
                switchBtnOff: DOM.yearSwitch,
                calendarOff: DOM.yearCalendar,
                animOff: DOM.myCalBox,
            },
        } : {
            on: {
                switchBtnOn: DOM.yearSwitch,
                calendarOn: DOM.yearCalendar,
                animOn: DOM.myCalBox,
            },
            off: {
                switchBtnOff: DOM.monthSwitch,
                calendarOff: DOM.monthCalendar,
                animOff: DOM.mCalBox,
            },
        });
    };

    return {
        init() {
            UICtrl.preset();
            setupEventListeners();
        },
    };
})(switchUIController);
switchController.init();
