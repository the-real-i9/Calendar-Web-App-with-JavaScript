/* eslint-disable prefer-const */
const yearCalController = (() => {
    const d = new Date();
    const calendarInfo = ({ whichYear = d.getFullYear(), whichMonth = d.getMonth() }) => {
        d.setFullYear(whichYear, whichMonth);

        const drefFrom = new Date(d.getFullYear(), d.getMonth());
        const drefTo = new Date(d.getFullYear(), d.getMonth() + 1);

        const year = d.getFullYear();

        const month = d.toLocaleDateString('en-US', { month: 'long' });

        const daysInMonth = (drefTo - drefFrom) / 1000 / 60 / 60 / 24;
        const weekStart = drefFrom.getDay();
        const weekEnd = 7 - drefTo.getDay();
        const currDate = new Date().getDate();
        const currWeek = new Date().getDay();
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear().toString();

        return {
            year, month, daysInMonth, weekStart, weekEnd, currDate, currWeek, currMonth, currYear,
        };
    };

    return {
        calendarInfo: (whichYear, whichMonth) => calendarInfo({ whichYear, whichMonth }),
    };
})();

const yearUIController = (() => {
    const DOMStrings = {
        allMonthsCont: '.months-of-the-year',
        oneMonth: '.month-of-year',
        monthName: '.month-name',
        weekDaysCont: '.weekdays',
        weekDays: '.wday',
        datesCont: '.dates',
        nextYearBtn: '#next-year',
        prevYearBtn: '#prev-year',
    };

    const selector = (elem) => document.querySelector(elem);

    const classAction = (el, action, classValue) => {
        selector(el).classList[action](classValue);
    };
    const setStyle = (el, prop, value) => {
        selector(el).style[prop] = value;
    };

    const htmlEmpty = '<span class="empty"></span>';

    const offset = (elem, week, count, num) => {
        if (week === num) return;
        selector(elem).insertAdjacentHTML('beforeend', htmlEmpty);
        count++;
        if (count === week) return;
        offset(elem, week, count, num);
    };

    const supply = (count, compareTo, elem, html) => {
        selector(elem).insertAdjacentHTML('beforeend', html);
        count++;
        if (count > compareTo) return;
        supply(count, compareTo, elem, html);
    };

    const insertHtml = (elem, where, html) => {
        selector(elem).insertAdjacentHTML(where, html);
    };

    return {
        preset({
            currDate, currWeek, currMonth, currYear,
        }) {
            let monthCountStart = 0;
            const monthCountEnd = 11;
            const [fh, sh] = [currYear.slice(0, 2), currYear.slice(2, currYear.length)];
            insertHtml(DOMStrings.nextYearBtn, 'beforebegin', `<div class="year">${fh}<span id='relv'>${sh}</span></div>`);

             const serveMonth = ({
                month, daysInMonth, weekStart, weekEnd,
            }) => {
                if (monthCountStart > monthCountEnd) return;
                let weekCountStart = 0;
                const weekCountEnd = 6;
                let countOffsetStart = 0;
                let countOffsetEnd = 0;
                const noOffsetStart = 0;
                const noOffsetEnd = 7;
                let dateCount = 1;
                const weekText = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

                // insert month to months container
                insertHtml(DOMStrings.allMonthsCont, 'beforeend', `<div class="month-of-year" id='moy-${monthCountStart}'></div>`);
                // insert the month name
                insertHtml(`#moy-${monthCountStart}`, 'beforeend', `<div class='month-name'>${month}</div>`);
                // insert weeks container
                insertHtml(`#moy-${monthCountStart}`, 'beforeend', `<div class="weekdays" id='wds-${monthCountStart}'>`);

                // Supply the weeks into weeks container
                const supplyWeeks = (count, compareTo, elem) => {
                    selector(elem).insertAdjacentHTML('beforeend', `<span class='wday' id="wday-${count}">${weekText[count]}</span>`);
                    count++;
                    if (count > compareTo) return;
                    supplyWeeks(count, compareTo, elem);
                };
                supplyWeeks(weekCountStart, weekCountEnd, `#wds-${monthCountStart}`);

                // insert dates container
                insertHtml(`#moy-${monthCountStart}`, 'beforeend', `<div class="dates" id='dates-${monthCountStart}'>`);

                // Add required empty cels to the start
                const offsetStart = offset;
                offsetStart(`#dates-${monthCountStart}`, weekStart, countOffsetStart, noOffsetStart);

                // supply the dates for the month
                const supplyDates = (count, compareTo, elem) => {
                    selector(elem).insertAdjacentHTML('beforeend', `<span class="date" id="date-${count}">${count}</span>`);
                    count++;
                    if (count > compareTo) return;
                    supplyDates(count, compareTo, elem);
                };
                supplyDates(dateCount, daysInMonth, `#dates-${monthCountStart}`);

                // // Add required empty cels to the end
                const offsetEnd = offset;
                offsetEnd(`#dates-${monthCountStart}`, weekEnd, countOffsetEnd, noOffsetEnd);

                // Increment to and call the function agin to serve subsequent months
                monthCountStart++;
                serveMonth(yearAppController.serveMonth({ monthNum: monthCountStart }));
            };
            serveMonth(yearAppController.serveMonth({ monthNum: monthCountStart }));

            classAction(`#moy-${currMonth} #date-${currDate}`, 'add', 'curr-date');
            classAction(`#moy-${currMonth} #wday-${currWeek}`, 'add', 'curr-wday');

        },

        getDOMStrings: () => DOMStrings,
        getSelector: (elem) => selector(elem),
    };
})();

const yearAppController = ((ycCtrl, UICtrl) => {
    const DOM = UICtrl.getDOMStrings();
    const select = (elem) => UICtrl.getSelector(elem);
    const setupEventListeners = () => {

    };

    const serveMonth = ({ year, monthNum }) => ycCtrl.calendarInfo(year, monthNum);

    return {
        init() {
            UICtrl.preset(ycCtrl.calendarInfo());
            setupEventListeners();
        },
        serveMonth: ({ year, monthNum }) => serveMonth({ year, monthNum }),
    };
})(yearCalController, yearUIController);
yearAppController.init();
