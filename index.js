#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const moment = require('moment');

const prompter = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// config
const WEEKDAY_COMMIT_CHANCE = 0.6; // 60%
const WEEKEND_DAY_COMMIT_CHANCE = 0.3; // 30%
const MIN_COMMITS = 1;
const MAX_COMMITS = 10;
const EARLIEST_COMMIT_TIME = '09:30';
const LATEST_COMMIT_TIME = '18:00';

let START_DATE_STR = '';
let END_DATE_STR = '';

console.clear();

console.log('WELCOME TO HACKTIVITY');
console.log('');

const executeBashCommandSync = command => {
    console.log(command);
    try {
        const stdout = execSync(command);
        console.log(String(stdout));
    } catch (error) {
        console.error(String(error));
    }
};

const generateActivityForDate = momentDate => {
    const folder = momentDate.format('YYYYMMDD');
    // create destination folder
    executeBashCommandSync(`mkdir -p ./fixtures/${folder}`);

    // loop a minimum of MIN_COMMITS times and a maximum of MAX_COMMITS with a 75% chance for another iteration between
    for (let i = 0; i < MIN_COMMITS || i < MAX_COMMITS && Math.random() < 0.75; i++) {
        const [earliestHour, earliestMin] = EARLIEST_COMMIT_TIME.split(':');
        const [latestHour, latestMin] = LATEST_COMMIT_TIME.split(':');
        const hourStr = String(Math.floor(Math.random() * (+latestHour - +earliestHour + 1) + +earliestHour));
        const hour = hourStr.length === 2 ? hourStr : `0${hourStr}`;
        const minuteStr = String(Math.floor(Math.random() * (+latestMin - +earliestMin + 1) + +earliestMin));
        const minute = minuteStr.length === 2 ? minuteStr : `0${minuteStr}`;

        const activityMoment = moment(`${momentDate.format('YYYY-MM-DD')}T${hour}:${minute}`);
        const filename = `${activityMoment.format('YYYYMMDDHHmm')}_${i + 1}`;
        // create empty file
        executeBashCommandSync(`touch -mt ${activityMoment.format('YYYYMMDDHHmm')} ./fixtures/${folder}/${filename}`);
        // stage and commit new file into git history
        executeBashCommandSync(`git add ./fixtures/${folder}/${filename}`);
        executeBashCommandSync(`git commit --date="${activityMoment.format('X')}" -m "Add ${filename}"`)
    }
};

const hack = () => {
    const startDate = moment(START_DATE_STR);
    const endDate = moment(END_DATE_STR);

    // validate date range
    if (startDate.isBefore(endDate)) {
        console.log('');
        console.log(`Hacking your activity from ${START_DATE_STR} to ${END_DATE_STR} 😈 `);
        console.log('');

        // iterate through every day from startDate through endDate
        for (let m = startDate; m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
            if (m.format('dddd') !== 'Saturday'
                && m.format('dddd') !== 'Sunday'
                && Math.random() < WEEKDAY_COMMIT_CHANCE
            ) {
                generateActivityForDate(m);
            } else if (Math.random() < WEEKEND_DAY_COMMIT_CHANCE) {
                generateActivityForDate(m);
            }
        }
        console.log('');
        console.log('Done. ');
        console.log('');
        console.log('"git push" to complete 😈 ');
        console.log('');
    } else {
        console.log(`Invalid date range: "(${START_DATE_STR}" - "${END_DATE_STR})" . `);
        console.log('Try again... ');
        console.log('');
    }
};

const dateFormat = 'YYYY-MM-DD';
const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
const validateDate = date => typeof date === 'string' && dateRegex.test(date);

const startDatePrompt = `When do you want commits to begin ? (${dateFormat}) `;
const endDatePrompt = `When do you want commits to end ? (${dateFormat}) `;
const retryDatePrompt = `Please enter a valid date in the ${dateFormat} format. `;

const handleEndDateResponse = date => {
    if (validateDate(date)) {
        END_DATE_STR = date;
        hack();
        console.log('');
        prompter.close();
    } else {
        console.log('');
        console.log(retryDatePrompt);
        console.log('');
        prompter.question(endDatePrompt, handleEndDateResponse)
    }
};

const handleStartDateResponse = date => {
    if (validateDate(date)) {
        START_DATE_STR = date;
        console.log('');
        prompter.question(endDatePrompt, handleEndDateResponse)
    } else {
        console.log('');
        console.log(retryDatePrompt);
        console.log('');
        prompter.question(startDatePrompt, handleStartDateResponse)
    }
};

prompter.question(startDatePrompt, handleStartDateResponse);

prompter.on('close', () => {
    console.log("\nBYE BYE !!! ✌️ ");
    console.log('');
    process.exit(0);
});
