// get elements
const searchResultForm = document.getElementById("search_result-form");
const searchMsg = document.querySelector(".search-msg");
const marksheetWrapper = document.querySelector(".marksheet_wrapper");

const loader = document.querySelector(".loader");

// submit search result form
searchResultForm.onsubmit = (e) => {
  e.preventDefault();

  // get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  //form validation
  if (!data.roll || !data.reg) {
    searchMsg.innerHTML = createAlert("All fields are required");
  } else if (!isNumber(data.roll)) {
    searchMsg.innerHTML = createAlert("Invalid Roll number", "warning");
  } else if (!isNumber(data.reg)) {
    searchMsg.innerHTML = createAlert("Invalid Reg number", "warning");
  } else {
    // remove everything if exist in it
    marksheetWrapper.innerHTML = "";

    // display loader
    loader.style.display = "block";

    // show result after 3 seconds loading
    setTimeout(() => {
      // hide loader
      loader.style.display = "none";

      // get LS data
      const allStudents = getLsData("students");

      // get searched student
      const student = allStudents.find(
        (item) => item.roll === data.roll && item.reg === data.reg
      );

      // check result exist or not
      if (!student || !student.result) {
        marksheetWrapper.innerHTML = `<p style="color:red; text-align:center; font-size:20px">No result found</p>`;
        e.target.reset();
        return;
      }

      // calculate if exist
      if (student.result) {
        // destructure marks
        const { bangla, english, math, science, social_science, religion } =
          student.result;

        //   student's result
        const result = getAllResult(
          bangla,
          english,
          math,
          science,
          social_science,
          religion
        );

        // show marksheet
        marksheetWrapper.innerHTML = `
      <div class="card shadow py-3">
      <div class="card-body">
        <h4 class="text-center">Mark Sheet</h4>
        <!-- result -->
        <div class="top-section p-3">
          <div class="row d-flex justify-content-between">
            <!-- student information -->

            <div class="col-md-9 info-wrapper">
              <div class="d-flex">
                <h6 style="width: 40%">Name of Student</h6>
                <p class="text-uppercase">
                  ${student.name}
                </p>
              </div>
              <div class="d-flex">
                <h6 style="width: 40%">Roll No.</h6>
                <p>${student.roll}</p>
              </div>
              <div class="d-flex">
                <h6 style="width: 40%">Registration No.</h6>
                <p>${student.reg}</p>
              </div>
              <div class="d-flex">
                <h6 style="width: 40%">Result</h6>
                <p class="text-uppercase"><strong>${result.finalResult}</strong></p>
              </div>
              <div class="d-flex">
                <h6 style="width: 40%">Cgpa</h6>
                <p><strong>${result.cgpa}</strong></p>
              </div>
            </div>

            <!-- student photo -->
            <div class="col-md-3">
              <img
                style="
                  height: 120px;
                  width: 120px;
                  object-fit: cover;
                  border: 3px rgb(210, 213, 216) solid;
                  border-radius: 5px;
                "
                src="${student.photo}"
                alt="${student.name}"
              />
            </div>
          </div>
        </div>
        <!-- grade sheet -->
        <div class="main-section py-3">
          <h4 class="text-center">Grade Sheet</h4>
          <table class="table table-bordered table-striped">
            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th>Mark</th>
              <th>Gpa</th>
              <th>Grade</th>
              <th>Cgpa</th>
              <th>Final Result</th>
            </tr>
            <tr class="align-middle">
              <td>101</td>
              <td>Bangla</td>
              <td>${bangla}</td>
              <td>${result.gpa_grade.ban_gpa}</td>
              <td>${result.gpa_grade.ban_grade}</td>
              <td class="text-center" rowspan="6">${result.cgpa}</td>
              <td class="text-center" rowspan="6">${result.finalResult}</td>
            </tr>
            <tr>
              <td>102</td>
              <td>English</td>
              <td>${english}</td>
              <td>${result.gpa_grade.eng_gpa}</td>
              <td>${result.gpa_grade.eng_grade}</td>
            </tr>
            <tr>
              <td>109</td>
              <td>Mathematics</td>
              <td>${math}</td>
              <td>${result.gpa_grade.math_gpa}</td>
              <td>${result.gpa_grade.math_grade}</td>
            </tr>
            <tr>
              <td>127</td>
              <td>Science</td>
              <td>${science}</td>
              <td>${result.gpa_grade.s_gpa}</td>
              <td>${result.gpa_grade.s_grade}</td>
            </tr>
            <tr>
              <td>145</td>
              <td>Social Science</td>
              <td>${social_science}</td>
              <td>${result.gpa_grade.ss_gpa}</td>
              <td>${result.gpa_grade.ss_grade}</td>
            </tr>
            <tr>
              <td>111</td>
              <td>Religion (Islam)</td>
              <td>${religion}</td>
              <td>${result.gpa_grade.reli_gpa}</td>
              <td>${result.gpa_grade.reli_grade}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
      `;
      }
    }, 3000);

    // reset form
    e.target.reset();
  }
};
