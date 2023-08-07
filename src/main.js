// get all data
const student_create_form = document.getElementById("student_create_form");
const msg = document.querySelector(".msg");

const studentList = document.querySelector(".all_students_data");
const single_student = document.querySelector(".single_student");

const student_edit_form = document.getElementById("student_edit_form");
const edit_msg = document.querySelector(".edit-msg");

const add_result_form = document.getElementById("add_result_form");
const result_msg = document.querySelector(".result-msg");

const edit_result_form = document.getElementById("edit_result_form");
const editResultMsg = document.querySelector(".edit-result-msg");

/**
 * show all students
 */
const getStudents = () => {
  const students = getLsData("students");

  // init
  let content = "";

  if (students.length > 0) {
    students.map((student, index) => {
      content += `<tr class="align-middle">
        <td>${index + 1}</td>
        <td>
          <img
            src="${student.photo}"
            alt="${student.name}"
            style="
              height: 60px;
              width: 60px;
              object-fit: cover;
              border-radius: 50%;
            "
          />
        </td>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.reg}</td>
        <td>${timeAgo(student.createdAt)}</td>
        <td>
          ${
            student.result === null
              ? `<button class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#add-result-modal" onclick = addResult("${student.id}")>Add Mark</button>`
              : `<button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#edit-result-modal" onclick = editResult("${student.id}")>View Mark</button>`
          }
        </td>
        <td>
          <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#show_single_student-modal" onclick = showSingleStudent("${
            student.roll
          }")>
            <i class="fa fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#edit-student-modal" onclick = editStudentData("${
            student.id
          }")>
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick = deleteStudent("${
            student.roll
          }")>
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>`;
    });
  } else {
    content = `<tr>
    <td colspan="8" class="text-center"> No data found</td>
    </tr>`;
  }
  // display students into table
  studentList.innerHTML = content;
};
getStudents();

/**
 * show single student
 */
const showSingleStudent = (roll) => {
  // get LS data
  const allStudents = getLsData("students");

  // get selected student's data
  const singleStudent = allStudents.find((student) => student.roll === roll);

  // display single student
  single_student.innerHTML = `<div class="card-body">
  <div class="row">
    <div class="col-md-4">
      <img
        src="${singleStudent.photo}"
        alt="${singleStudent.name}"
        style="object-fit: cover"
        class="w-100 rounded h-100"
      />
    </div>
    <div class="col-md-8">
      <table class="table">
        <tr>
          <th scope="row">Student Name</th>
          <td>${singleStudent.name}</td>
        </tr>
        <tr>
          <th scope="row">Student Roll</th>
          <td>${singleStudent.roll}</td>
        </tr>
        <tr>
          <th scope="row">Student Reg No.</th>
          <td>${singleStudent.reg}</td>
        </tr>
      </table>
    </div>
  </div>
</div>`;
};

/**
 * add Result
 */
const addResult = (id) => {
  add_result_form.querySelector('input[name="id"]').value = id;
};

/**
 * submit add result form
 */
add_result_form.onsubmit = (e) => {
  e.preventDefault();

  // get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const { bangla, english, math, science, social_science, religion } =
    Object.fromEntries(formData.entries());

  // form validation
  if (
    !bangla ||
    !english ||
    !math ||
    !science ||
    !social_science ||
    !religion
  ) {
    result_msg.innerHTML = createAlert("All fields are required");
  } else if (
    !isMark(bangla) ||
    !isMark(english) ||
    !isMark(math) ||
    !isMark(science) ||
    !isMark(social_science) ||
    !isMark(religion)
  ) {
    result_msg.innerHTML = createAlert("Invalid Number", "warning");
  } else {
    // get LS data
    const allStudents = getLsData("students");

    // update data (result)
    allStudents[allStudents.findIndex((item) => item.id === data.id)] = {
      ...allStudents[allStudents.findIndex((item) => item.id === data.id)],
      result: data,
    };
    // // send data to LS
    sendDataLS("students", allStudents);

    // success message
    result_msg.innerHTML = createAlert("Result added successfully", "success");

    getStudents();
    // reset form
    e.target.reset();
  }
};

/**
 * edit result
 */
const editResult = (id) => {
  // get LS data
  const allStudents = getLsData("students");

  // get selected student
  const student = allStudents.find((item) => item.id === id);

  // show mark on edit result form
  edit_result_form.querySelector('input[name="bangla"]').value =
    student.result.bangla;
  edit_result_form.querySelector('input[name="english"]').value =
    student.result.english;
  edit_result_form.querySelector('input[name="math"]').value =
    student.result.math;
  edit_result_form.querySelector('input[name="science"]').value =
    student.result.science;
  edit_result_form.querySelector('input[name="social_science"]').value =
    student.result.social_science;
  edit_result_form.querySelector('input[name="religion"]').value =
    student.result.religion;
  edit_result_form.querySelector('input[name="id"]').value = student.id;
};

/**
 * submit edit result form
 */
edit_result_form.onsubmit = (e) => {
  e.preventDefault();

  // get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // destructure data
  const { bangla, english, math, science, social_science, religion } = data;

  // form validation

  if (
    !bangla ||
    !english ||
    !math ||
    !science ||
    !social_science ||
    !religion
  ) {
    editResultMsg.innerHTML = createAlert("All fields are required");
  } else if (
    !isMark(bangla) ||
    !isMark(english) ||
    !isMark(math) ||
    !isMark(science) ||
    !isMark(social_science) ||
    !isMark(religion)
  ) {
    editResultMsg.innerHTML = createAlert("Invalid Number", "warning");
  } else {
    // get LS data
    const allStudents = getLsData("students");

    // update data (result)
    allStudents[allStudents.findIndex((item) => item.id === data.id)] = {
      ...allStudents[allStudents.findIndex((item) => item.id === data.id)],
      result: data,
    };
    // // send data to LS
    sendDataLS("students", allStudents);

    // success message
    editResultMsg.innerHTML = createAlert(
      "Result updated successfully",
      "success"
    );

    getStudents();
  }
};

/**
 * edit student data
 */
const editStudentData = (id) => {
  // get LS data
  const allStudents = getLsData("students");

  // get selected student's data
  const student = allStudents.find((item) => item.id === id);

  // show data in in edit form modal
  student_edit_form.querySelector('input[name="name"]').value = student.name;
  student_edit_form.querySelector('input[name="roll"]').value = student.roll;
  student_edit_form.querySelector('input[name="reg"]').value = student.reg;
  student_edit_form.querySelector('input[name="photo"]').value = student.photo;
  student_edit_form.querySelector('input[name="id"]').value = student.id;
  student_edit_form.querySelector("img").setAttribute("src", student.photo);
};

/**
 * edit form submit
 */
student_edit_form.onsubmit = (e) => {
  e.preventDefault();

  // get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // validation
  if (!data.name || !data.roll || !data.reg) {
    edit_msg.innerHTML = createAlert("All fields are required");
  } else if (!isNumber(data.roll)) {
    edit_msg.innerHTML = createAlert("Invalid Roll number", "warning");
  } else if (!isNumber(data.reg)) {
    edit_msg.innerHTML = createAlert("Invalid Reg number", "warning");
  } else {
    // get LS data
    const allStudents = getLsData("students");

    // get all students without selected student (for prevent duplicate)
    const allWithoutCurrent = allStudents.filter((item) => {
      return item.id !== data.id;
    });

    // check Roll number is already exist ?
    if (allWithoutCurrent.some((item) => item.roll === data.roll)) {
      edit_msg.innerHTML = createAlert("Roll already exists");
      return; // stop the function
    }

    // check Reg number is already exist ?
    if (allWithoutCurrent.some((item) => item.reg === data.reg)) {
      edit_msg.innerHTML = createAlert("Reg no. already exists");
      return;
    }

    // // update data (without result and timeStamp)
    allStudents[allStudents.findIndex((item) => item.id === data.id)] = {
      ...allStudents[allStudents.findIndex((item) => item.id === data.id)],
      ...data,
    };

    // // send data to LS
    sendDataLS("students", allStudents);

    // success message
    edit_msg.innerHTML = createAlert(
      `<strong>${data.name}</strong> updated successfully`,
      "success"
    );

    getStudents();
  }
};

/**
 * delete student
 */
const deleteStudent = (roll) => {
  const conf = confirm("Are you sure ?");

  if (conf) {
    // get LS data
    const oldStudents = getLsData("students");

    // filter data
    const updatedData = oldStudents.filter((student) => student.roll !== roll);

    // update LS data
    sendDataLS("students", updatedData);
    getStudents();
  }
};

/**
 * submit student create form
 *
 */

student_create_form.onsubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // validation
  if (!data.name || !data.roll || !data.reg) {
    msg.innerHTML = createAlert("All fields are required");
  } else if (!isNumber(data.roll)) {
    msg.innerHTML = createAlert("Invalid Roll number", "warning");
  } else if (!isNumber(data.reg)) {
    msg.innerHTML = createAlert("Invalid Reg number", "warning");
  } else {
    // get LS data
    const oldStudents = getLsData("students");

    // check Roll number is already exist ?
    if (oldStudents.some((item) => item.roll === data.roll)) {
      msg.innerHTML = createAlert("Roll already exists");
      return;
    }

    // check Reg number is already exist ?
    if (oldStudents.some((item) => item.reg === data.reg)) {
      msg.innerHTML = createAlert("Reg no. already exists");
      return;
    }

    // data push
    oldStudents.push({
      ...data,
      result: null,
      createdAt: Date.now(),
      id: getRandomUniqueID(26),
    });

    // send data to LS
    sendDataLS("students", oldStudents);

    // success message
    msg.innerHTML = createAlert(
      `<strong>${data.name}</strong> created successfully`,
      "success"
    );

    // reset form
    e.target.reset();

    getStudents();
  }
};
