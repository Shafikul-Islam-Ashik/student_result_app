/**
 * alert function
 */

const createAlert = (msg, type = "danger") => {
  return `<p class="alert alert-${type} d-flex justify-content-between"> ${msg} <button class="btn-close" data-bs-dismiss="alert"></button></p>`;
};

/**
 * get LS data
 */
const getLsData = (key) => {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return [];
  }
};

/**
 * send data to LS
 */
const sendDataLS = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * number checking ( roll and reg )
 */
const isNumber = (num) => {
  const pattern = /^[0-9]{6,10}$/;
  return pattern.test(num);
};

/**
 * mark checking for result (0 to 100)
 */
const isMark = (num) => {
  const pattern = /^(0|([1-9]\d{0,1})|100)$/;
  return pattern.test(num);
};

/**
 * Time Ago function
 */
const timeAgo = (timestamp) => {
  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    return "Just now";
  } else if (timeDifference < hour) {
    const minutesAgo = Math.floor(timeDifference / minute);
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDifference < day) {
    const hoursAgo = Math.floor(timeDifference / hour);
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else if (timeDifference < month) {
    const daysAgo = Math.floor(timeDifference / day);
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  } else if (timeDifference < year) {
    const monthsAgo = Math.floor(timeDifference / month);
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  } else {
    const yearsAgo = Math.floor(timeDifference / year);
    return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
  }
};

/**
 * random unique id generator function
 */
const getRandomUniqueID = (length = 10) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charCount = charset.length;
  let randomValues;

  // Check for crypto object and getRandomValues
  if (
    typeof window !== "undefined" &&
    (window.crypto || window.msCrypto) &&
    window.crypto.getRandomValues
  ) {
    randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
  } else {
    // Fallback for browsers that do not support crypto.getRandomValues()
    randomValues = new Uint32Array(length);
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * charCount);
    }
  }

  let randomId = "";
  for (let i = 0; i < length; i++) {
    let randomIndex;
    do {
      randomIndex = randomValues[i] & (charCount - 1);
    } while (randomValues[i] - randomIndex + (charCount - 1) < 0);
    randomId += charset[randomIndex];
  }

  return randomId;
};

/**
 * function for calculate "gpa and grade" of a subject
 * @param {mark of a subject} mark
 * @returns 'grade' and 'gpa' within an object
 */

const getResult = (mark) => {
  let grade;
  let gpa;

  if (mark >= 0 && mark < 33) {
    grade = "F";
    gpa = 0;
  } else if (mark >= 33 && mark < 40) {
    grade = "D";
    gpa = 1;
  } else if (mark >= 40 && mark < 50) {
    grade = "C";
    gpa = 2;
  } else if (mark >= 50 && mark < 60) {
    grade = "B";
    gpa = 3;
  } else if (mark >= 60 && mark < 70) {
    grade = "A-";
    gpa = 3.5;
  } else if (mark >= 70 && mark < 80) {
    grade = "A";
    gpa = 4;
  } else if (mark >= 80 && mark <= 100) {
    grade = "A+";
    gpa = 5;
  } else {
    grade = "Invalid";
    gpa = "Invalid";
  }
  return {
    grade: grade,
    gpa: gpa,
  };
}; // ends getResult function


/**
 * function for claculate final result (gpa, grade and cgpa) of all subject
 * @param {mark of bnagla} ban
 * @param {mark of english} eng
 * @param {mark of math} math
 * @param {mark of science} s
 * @param {mark of social_science} ss
 * @param {mark of religion} reli
 * @returns result (passed/failed) and letterGrades (mark,gpa,grade) of all subject in object format {finalResult:val,cgpa: val, letterGrade: val}
 */

const getAllResult = (ban, eng, math, s, ss, reli) => {
  // get result (gpa and grade)
  let ban_result = getResult(ban);
  let eng_result = getResult(eng);
  let math_result = getResult(math);
  let s_result = getResult(s);
  let ss_result = getResult(ss);
  let reli_result = getResult(reli);

  // get gpa
  let ban_gpa = ban_result.gpa;
  let eng_gpa = eng_result.gpa;
  let math_gpa = math_result.gpa;
  let s_gpa = s_result.gpa;
  let ss_gpa = ss_result.gpa;
  let reli_gpa = reli_result.gpa;

  // get grade
  let ban_grade = ban_result.grade;
  let eng_grade = eng_result.grade;
  let math_grade = math_result.grade;
  let s_grade = s_result.grade;
  let ss_grade = ss_result.grade;
  let reli_grade = reli_result.grade;

  //init val
  let finalResult = "";
  let cgpa;

  if (
    ban >= 33 &&
    eng >= 33 &&
    math >= 33 &&
    s >= 33 &&
    ss >= 33 &&
    reli >= 33
  ) {
    // cgpa calculation
    cgpa = (
      (ban_gpa + eng_gpa + math_gpa + s_gpa + ss_gpa + reli_gpa) /
      6
    ).toFixed(2);
    finalResult = "Passed";
  } else {
    cgpa = 0;
    finalResult = "Failed";
  }

  // returns result and letterGrades
  return {
    finalResult: finalResult,
    cgpa: cgpa,
    gpa_grade: {
      ban_gpa,
      ban_grade,
      eng_gpa,
      eng_grade,
      math_gpa,
      math_grade,
      s_gpa,
      s_grade,
      ss_gpa,
      ss_grade,
      reli_gpa,
      reli_grade,
    },
  };
}; // ends getAllResult function
