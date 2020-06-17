const switchUIController = (() => {
    const DOMStrings = {
        monthSwitch: '#month-switch',
        yearSwitch: '#year-switch',
        monthCalendar: '.month-calendar',
        yearCalendar: '.year-calendar',
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
        },

        switchCal({ on, off }) {
            const [{ switchBtnOn, calendarOn }, { switchBtnOff, calendarOff }] = [on, off];
            classAction(switchBtnOn, 'add', 'switch-on');
            classAction(switchBtnOff, 'remove', 'switch-on');
            setStyle(calendarOn, 'display', 'flex');
            setStyle(calendarOff, 'display', 'none');
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

        event(DOM.monthSwitch, 'click', switchCal);
        event(DOM.yearSwitch, 'click', switchCal);
    };

    const switchCal = (ev) => {
        UICtrl.switchCal(ev.target.id === 'month-switch' ? {
            on: {
                switchBtnOn: DOM.monthSwitch,
                calendarOn: DOM.monthCalendar,
            },
            off: {
                switchBtnOff: DOM.yearSwitch,
                calendarOff: DOM.yearCalendar,
            },
        } : {
            on: {
                switchBtnOn: DOM.yearSwitch,
                calendarOn: DOM.yearCalendar,
            },
            off: {
                switchBtnOff: DOM.monthSwitch,
                calendarOff: DOM.monthCalendar,
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
