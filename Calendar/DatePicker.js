/*!
 * @author Hao Li
 * DatePicker - v1.0.0 (2019-04-22 10:44:11).
 * @render and display the calendar that includes the day passed in.
 * @param {Date} date to be rendered.
 * @param {String} id html id for a specific datepicker.
 * @param {Function} callback function to be executed when clicking on a day button.
 */

"use strict";

function DatePicker(id, callback) {
	this.id = id;
	this.dateSelection = callback;
	this.date = null;
}
// Constructor of the DatePicker class

DatePicker.prototype.render = function(date){

	if (typeof date.getMonth !== "function") {
        return;
        // if the parameter of render function is not a date object, return immediately 
    }

	this.date = date;// update the class date attribute
	var datepicker = document.getElementById(this.id);

	var firstDayofMonth = new Date(date);
	firstDayofMonth.setDate(1);
	var startofFirstWeek = firstDayofMonth.getDay();
	// the weekday of the start of the current month

    var getDaysInOneMonth = function(_date) {
    	let tempDate = new Date(_date);
		let curMonth = _date.getMonth();
		tempDate.setMonth(curMonth+1);
		tempDate.setDate(0);
		return tempDate.getDate();
		// return the number of days in the month 
    };

    function getPrevMonthDate(_date) {
    	let prevMonthDate = new Date(_date);
		let curMonth = _date.getMonth();
		prevMonthDate.setMonth(curMonth-1);
		return prevMonthDate;
		// return the previous month 
    }

    function getNextMonthDate(_date) {
    	let nextMonthDate = new Date(_date);
		let curMonth = _date.getMonth();
		nextMonthDate.setMonth(curMonth+1);
		return nextMonthDate;
		// return the next month 
    }

    var getCurrentMonth = function(date) {
		var month = date.getMonth();
		switch (month) {
			case 0:
				return "January";
			case 1:
				return "February";
			case 2:
				return "March";
			case 3:
				return "April";
			case 4:
				return "May";
			case 5:
				return "June";
			case 6:
				return "July";
			case 7:
				return "August";
			case 8:
				return "September";
			case 9:
				return "October";
			case 10:
				return "November";
			case 11:
				return "December";
		}
		// Translate the months(0-11) into words
    };

    var dayOfWeek = function(day) {
        switch (day) {
            case 0:
                return "Su";
            case 1:
                return "Mo";
            case 2:
                return "Tu";
            case 3:
                return "We";
            case 4: 
                return "Th";
            case 5:
                return "Fr";
            case 6:
                return "Sa";
        }
        // Translate the weekdays(0-6) into prefixes 
    };

    var daysHeader = function() {
        let header = "";
        for (let i = 0; i < 7; i++) {
            header += "<span class='days-header-component'>" + dayOfWeek(i) + "</span>";
        } 
        return header;
        // build abbreviations for the days of the week, such as "Su", "Mo", etc.
    };

	var populateFirstWeek = function(id, date, weekdayOfFirstDay) {

		// populate the remaining days of previous month's week.
		var prevMonthDate = getPrevMonthDate(date);
		let daysOfPrevMonth = getDaysInOneMonth(prevMonthDate);
		let firstWeek = "";
		let start = daysOfPrevMonth - weekdayOfFirstDay + 1;
		for(let i=1;i <= weekdayOfFirstDay; i++){
			firstWeek += "<div class='otherMonthDays'>" + start + "</div>";
			start ++;
		}
		// populate the days in the first week of current month.
		for(let j=1; j<=7-weekdayOfFirstDay; j++){
			firstWeek += "<div class='day'><button id='" + id + "-day" + j + "'>" + j + "</button></div>";
		}
		return firstWeek;
	};

	function populateRestOfTheMonth (date,id,datepicker) {
		//populate the weeks except the last one
    	let numDaysInCurrMonth = getDaysInOneMonth(date);
		let week = "";
	    for(let k=8-startofFirstWeek; k<= numDaysInCurrMonth; k++){
			week += "<div class='day'><button id='" + id + "-day" + k + "'>" + k + "</button></div>";
			if((k+startofFirstWeek)%7 === 0){
				datepicker.innerHTML += "<div class='week'>" + week + "</div>";
				week = "";
			}
		}

		//get the begining of next month
		let nextMonthBeginning = getNextMonthDate(date);
		nextMonthBeginning.setDate(1);
		let weekdayBeginningNextMonth = nextMonthBeginning.getDay();
		let startOfNextMonth = 1;

		//populate the last week on the calendar
		if (week !=="" && weekdayBeginningNextMonth !== 0){
			for (let i = weekdayBeginningNextMonth; i < 7; i++){
				week += "<div class='otherMonthDays'>"+startOfNextMonth+"</div>";
				startOfNextMonth ++;
			}
			datepicker.innerHTML += "<div class='week'>" + week + "</div>";
		}
    }

    // Makes header of DatePicker.
	datepicker.innerHTML =  "<div class='datepicker-header'>" + 
                                "<a id='" + this.id + "-back-button'>&#171;</a>" + 
                                "<div class='monthYears'>" + 
                                    getCurrentMonth(date) + " " + date.getFullYear() + 
                                "</div>" + 
                                "<a id='" + this.id + "-forward-button'>&#187;</a>" + 
                            "</div>";
    
    datepicker.innerHTML += "<div class='days-header'>" + daysHeader() + "</div>";
	//add abbreviations for the days of the week

    datepicker.innerHTML += "<div class='week'>" + populateFirstWeek(this.id, date, startofFirstWeek) + "</div>";
    // populate the first week of the month on the calendar.
    
    populateRestOfTheMonth(date,this.id,datepicker);
    // populate the rest and the last week of the month on the calendar.

    document.getElementById(this.id + "-back-button").addEventListener("click", () => {
            this.render(getPrevMonthDate(this.date));
    });
    	// add eventListener for the backward button

	document.getElementById(this.id + "-forward-button").addEventListener("click", () => {
			this.render(getNextMonthDate(this.date));
	});
	// add eventListener for the forward button

	let numDaysInCurrMonth = getDaysInOneMonth(date);
	for (var i = 1; i <= numDaysInCurrMonth; i++) {
		(function(_this,i){
		document.getElementById(_this.id + "-day" + i).addEventListener("click", () => {
			_this.dateSelection(_this.id,{month:_this.date.getMonth()+1,day:i,year:_this.date.getFullYear()});
		});
		}(this,i));
	// add eventListener for each day of the current month.	
	}

};



